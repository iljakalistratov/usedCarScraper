import express from 'express'
import { scrapeEbayKl } from './scraper/ebayKl'

const app = express()
const port = 5000


app.get('/', (_,res) => {
  res.status(200).send("Hello World!")
})

app.get('/scrapeEbay', async (_,res) => {
  const results = await scrapeEbayKl('celica');
  res.status(200).send(results);
  })

app.listen(port, () => console.log(`Running on port ${port}`))


