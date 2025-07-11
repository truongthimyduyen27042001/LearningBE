const express = require('express');
const app = express();
const port = 3000;
const pool = require('./db');

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/', async (req, res) => {
  const { name, location } = req.body;
  await pool.query('INSERT INTO users (name, location) VALUES ($1, $2)', [name, location]);
  res.status(201).send({
    message: 'User created successfully',
    user: {
      name,
      location
    }
  });

})

app.get('/setup', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), location VARCHAR(255))');
    await client.query('INSERT INTO users (name, location) VALUES ($1, $2)', ['John Doe', 'New York']);
    await client.query('INSERT INTO users (name, location) VALUES ($1, $2)', ['Jane Doe', 'Los Angeles']);
    await client.query('INSERT INTO users (name, location) VALUES ($1, $2)', ['Jim Beam', 'Chicago']);
    await client.query('INSERT INTO users (name, location) VALUES ($1, $2)', ['Jill Hill', 'Houston']);
    await client.query('INSERT INTO users (name, location) VALUES ($1, $2)', ['Jack Sparrow', 'San Francisco']);
    res.status(200).send({
      message: 'Table created successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});