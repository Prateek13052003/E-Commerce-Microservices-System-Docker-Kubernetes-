const express = require('express');
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://mongo-products:27017/products")
.then(() => console.log("MongoDB connected (products)"))
.catch(err => console.log(err));

app.get('/health', (req, res) => {
  res.json({ status: 'product-service ok' });
});

app.post('/', (req, res) => {
  res.json({ message: "Product created", data: req.body });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Product service running on ${PORT}`));
