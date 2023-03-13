import express from 'express'
import { scrapeEbayKl } from './scraper/ebayKl'

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

app.listen(port, () => console.log(`Running on port ${port}`))


