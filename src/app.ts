import express from 'express'
import { scrapeEbayKl } from './scraper/ebayKl'
import { scrapeAutoscout24 } from './scraper/autoscout24'
import { getMakeByModel } from './functions/carDatabaseFunctions'

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

app.listen(port, () => console.log(`Running on port ${port}`))


