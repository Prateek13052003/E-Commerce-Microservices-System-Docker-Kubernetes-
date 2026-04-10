const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://mongo-products:27017/products")
.then(() => console.log("MongoDB connected (products)"))
.catch(err => console.log(err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: String,
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));

app.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = new RegExp(search, 'i');
    const products = await Product.find(filter);
    res.json(products);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch(err) { res.status(400).json({ error: err.message }); }
});

app.patch('/:id/stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: -quantity } },
      { new: true }
    );
    res.json(product);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Product service running on ${PORT}`));
