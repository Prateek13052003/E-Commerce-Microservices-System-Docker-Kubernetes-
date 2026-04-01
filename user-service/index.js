const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Mongo connection
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo-users:27017/users")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'user-service ok' });
});

app.post('/register', (req, res) => {
  const { name, email } = req.body;
  res.json({ message: "User registered", name, email });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`User service running on ${PORT}`));
