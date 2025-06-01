import express from 'express'
import { scrapeEbayKl } from './scraper/ebayKl'
import { scrapeAutoscout24 } from './scraper/autoscout24'
import { getMakeByModel } from './functions/carDatabaseFunctions'
import { mainLogic } from './functions/businessLogic'
import { testTgBot, sendAds } from './functions/telegramNotificator'
import {
  checkIfCarAdAlreadyInDb,
  addCarAdToDb,
} from "./databases/mongodb";

testTgBot();

const app = express()
const port = 5000


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
  const results = await scrapeAutoscout24(make, model);
  res.status(200).send(results);
  })

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
app.get("/addCarAd", async (req, res) => {
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

app.listen(port, () => console.log(`Running on port ${port}`))
