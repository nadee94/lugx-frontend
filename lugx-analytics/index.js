import express from 'express';
import cors from 'cors';           // npm i cors
import { createClient } from '@clickhouse/client';

const app = express();
app.use(cors());                  // allow all origins
app.use(express.json());

const ch = createClient({ url: 'http://3.142.123.176:8123' });

app.post('/event', async (req, res) => {
  try {
     const { event, path, user_id, scroll_depth = 0, session_time = 0 } = req.body
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await ch.insert({
      table: 'analytics.events',
       values: [{ event, path, user_id, scroll_depth, session_time, ts }],	
      format: 'JSONEachRow'
    });
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});
app.get('/health', (_, res) => res.send('ok'));
app.listen(3000, () => console.log('Analytics on :3000'));
