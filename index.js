const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')
require('dotenv').config();

// console.log(process.env)

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at ${port}!`))

app.use(express.static('public'));
app.use(express.json({ limit: '1Mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end()
      return
    }
    res.json(data)

  })
})

app.post('/api', (req, res) => {
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  res.json(data);
})

app.get('/weather/:latlon', async (req, res) => {
  const latlon= req.params.latlon.split(',')
  const [lat, lon] = latlon

  const api_key = process.env.API_KEY
  const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`
  const weather_response = await fetch(weather_url)
  const weather_data = await weather_response.json()

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
  const aq_response = await fetch(aq_url)
  const aq_data = await aq_response.json()

  const data = {
    weather: weather_data,
    air_quality: aq_data
  }

  res.json(data)
})

