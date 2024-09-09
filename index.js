require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express');
const cors = require('cors');
const app = express();
const URLModel = require('./urlSchema.js') 

// Basic Configuration
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  try{

    const parsedUrl = new URL(req.body.url)

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:'){
      return res.json({ error: 'invalid url' });
    }      

    const existingUrl = await URLModel.findOne({ originalUrl: parsedUrl.href });
    if (existingUrl) return res.json({ originalUrl: existingUrl.originalUrl, shortUrl: existingUrl.shortUrl });

    const count = await URLModel.countDocuments({}) + 1

    const url = new URLModel({
      originalUrl: parsedUrl.href,
      shortUrl: count
    })
    const result = await url.save()
    res.json({ original_url: result.originalUrl, short_url: result.shortUrl});

  } catch (e) {
    res.json({ error: 'invalid url' });
  }
})

app.get('/api/shorturl/:surl', async (req, res) => {
  const surl = req.params.surl
  const existingUrl = await URLModel.findOne({ shortUrl: surl });
    if (existingUrl) return res.redirect(existingUrl.originalUrl);
    res.json({error: 'No existe esa url'})
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
