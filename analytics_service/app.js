const express = require('express');
const { createClient } = require('@clickhouse/client');
const app = express();

const clickhouse = createClient({
  host: 'http://clickhouse:8123',
  username: 'default',
  password: 'your_secure_password'
});

app.use(express.json());

app.post('/api/track', async (req, res) => {
  try {
    await clickhouse.insert({
      table: 'page_views',
      values: [{ page_url: req.body.page_url }],
      format: 'JSONEachRow'
    });
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});


app.get('/health', (req, res) => res.sendStatus(200));



app.listen(3000, () => console.log('Running on 3000'));
