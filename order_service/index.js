const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Order Service is running!');
});

// Create an order


app.post('/orders', async (req, res) => {
  const { product_name, quantity, price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (product_name, quantity, price) VALUES ($1, $2, $3) RETURNING *',
      [product_name, quantity, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});




// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
