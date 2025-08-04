const express = require('express');
const pool = require('./db');
const app = express();
app.use(express.json());

app.get('/', (_, res) => res.send('Game Service is running!'));

// GET all games
app.get('/games', async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM games ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// POST a new game
app.post('/games', async (req, res) => {
  const { name, genre, price } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO games(name, genre, price) VALUES($1,$2,$3) RETURNING *',
      [name, genre, price]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Game Service on ${PORT}`));
