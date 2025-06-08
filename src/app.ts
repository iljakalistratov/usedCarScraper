import express from 'express'
import { scrapeEbayKl } from './scraper/ebayKl'
import { getMakeByModel } from './functions/carDatabaseFunctions'
import { mainLogic } from './functions/businessLogic'
import { testTgBot, sendAds } from './functions/telegramNotificator'
import {
  checkIfCarAdAlreadyInDb,
  addCarAdToDb,
  createUser,
  deleteUser,
} from "./databases/mongodb";
import { scrapeAutoscout24Data } from './scraper/autoscout24'
import { scrapeWillhaben } from './scraper/willhaben';

testTgBot();

const app = express()
const port = 5000

app.use(express.json());

app.get('/', (_,res) => {
  res.status(200).send("Hello World!")
})

app.get('/scrapeEbay/:keyword', async (req,res) => {
  const keyword = req.params.keyword;
  const results = await scrapeEbayKl(keyword);
  res.status(200).send(results);
  })

app.get('/scrapeAutoscout/:make/:model', async (req, res) => {
  const make = req.params.make;
  const model = req.params.model;
  const results = await scrapeAutoscout24Data(make, model);
  res.status(200).send(results);
  })

app.get('/scrapeWillhaben/:make/:model', async (req, res) => {
  try {
    const make = req.params.make;
    const model = req.params.model;
    const results = await scrapeWillhaben(make, model);
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send(`Error scraping Willhaben: ${err}`);
  }
});

app.get('/getMakebyModel/:model', async (req, res) => {
  const model = req.params.model;
  const results = await getMakeByModel(model);
  res.status(200).send(results);
  })

app.get('/testDatabase', async (_, res) => {
  
  await mainLogic();
  res.status(200).send("Database updated");
  })

// 4) Check if a CarAd already exists in DB for a user (use query params for link)
app.get("/checkCarAd", async (req, res) => {
  try {
    const chatId = parseInt(req.query.chatId as string, 10);
    const link = req.query.link as string;
    if (!chatId || !link) {
      return res
        .status(400)
        .send("Missing required query parameters: chatId, link.");
    }
    const exists = await checkIfCarAdAlreadyInDb(chatId, link);
    res
      .status(200)
      .send(
        `CarAd with link "${link}" for user ${chatId} ${
          exists ? "exists" : "does not exist"
        }.`
      );
  } catch (err) {
    res.status(500).send(`Error checking CarAd: ${err}`);
  }
});

// 5) Add a CarAd to the DB (use query params for all fields)
app.post("/addCarAd", async (req, res) => {
  try {
    const chatId = parseInt(req.query.chatId as string, 10);
    const title = req.query.title as string;
    const link = req.query.link as string;
    // Optional fields:
    const price = req.query.price as string | undefined;
    const km = req.query.km as string | undefined;
    const year = req.query.year as string | undefined;
    const imgSrc = req.query.imgSrc as string | undefined;

    if (!chatId || !title || !link) {
      return res
        .status(400)
        .send(
          "Missing required query parameters: chatId, title, link. Optional: price, km, year, imgSrc."
        );
    }

    const newAd = await addCarAdToDb(chatId, {
      title,
      link,
      price,
      km,
      year,
      imgSrc,
    });

    if (newAd) {
      res.status(200).send(`CarAd added for user ${chatId}: ${JSON.stringify(newAd)}`);
    } else {
      res
        .status(400)
        .send(
          `CarAd with link "${link}" already exists for user ${chatId}.`
        );
    }
  } catch (err) {
    res.status(500).send(`Error adding CarAd: ${err}`);
  }
});

// --- User MongoDB REST Endpoints ---

// Create a new user
app.post("/user", async (req, res) => {
  try {
    const { chatId, timePeriod, cars } = req.body;

    if (!chatId || !timePeriod) {
      return res.status(400).send("Missing required fields: chatId, timePeriod. Optional: cars (JSON array)");
    }

    let parsedCars: Array<{ make: string; model: string }> = [];
    if (cars) {
      try {
        parsedCars = cars;
      } catch (e) {
        return res.status(400).send("Invalid cars format. Must be JSON array.");
      }
    }

    const user = await createUser({ chatId, timePeriod, cars: parsedCars });
    res.status(200).send(`User created: ${JSON.stringify(user)}`);
  } catch (err) {
    res.status(500).send(`Error creating user: ${err}`);
  }
});

// Delete a user by chatId
app.delete("/user/:chatId", async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId, 10);
    if (!chatId) {
      return res.status(400).send("Missing or invalid chatId parameter.");
    }
    await deleteUser(chatId);
    res.status(200).send(`User with chatId ${chatId} deleted.`);
  } catch (err) {
    res.status(500).send(`Error deleting user: ${err}`);
  }
});

app.listen(port, () => console.log(`Running on port ${port}`))
