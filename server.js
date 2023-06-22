require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

app.use(express.json());


// Register user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    // Hash the password before storing it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) throw err;
  
      const user = { username, password: hashedPassword, email: '' };
      connection.query('INSERT INTO users SET ?', user, (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to register user.' });
        } else {
          res.status(200).json({ message: 'User registered successfully.' });
        }
      });
  
     
    });
  });

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', username, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to log in.' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'User not found.' });
    } else {
      const user = results[0];

      // Compare the provided password with the hashed password 
      bcrypt.compare(password, user.password, (err, passwordsMatch) => {
        if (err) {
          res.status(500).json({ error: 'Failed to log in.' });
        } else if (passwordsMatch) {
          res.status(200).json({ message: 'Login successful.' });
        } else {
          res.status(401).json({ error: 'Invalid password.' });
        }
      });
    }
  });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
