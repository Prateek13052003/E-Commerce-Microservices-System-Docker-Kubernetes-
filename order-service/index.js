const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Correct Mongo DB for orders
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo-orders:27017/orders")
.then(() => console.log("MongoDB connected (orders)"))
.catch(err => console.log(err));

app.get('/health', (req, res) => {
  res.json({ status: 'order-service ok' });
});

app.post('/', (req, res) => {
  res.json({ message: "Order placed", data: req.body });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Order service running on ${PORT}`));
