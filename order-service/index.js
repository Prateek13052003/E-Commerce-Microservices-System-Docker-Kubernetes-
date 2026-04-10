const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://mongo-orders:27017/orders")
.then(() => console.log("MongoDB connected (orders)"))
.catch(err => console.log(err));

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{ productId: String, name: String, price: Number, quantity: Number }],
  totalAmount: Number,
  status: { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const NOTIF_URL   = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3004';

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'order-service' }));

app.post('/', async (req, res) => {
  try {
    const { userId, items } = req.body;
    let totalAmount = 0;
    const enrichedItems = [];
    for (const item of items) {
      const { data: product } = await axios.get(`${PRODUCT_URL}/${item.productId}`);
      if (product.stock < item.quantity)
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      await axios.patch(`${PRODUCT_URL}/${item.productId}/stock`, { quantity: item.quantity });
      enrichedItems.push({ productId: item.productId, name: product.name, price: product.price, quantity: item.quantity });
      totalAmount += product.price * item.quantity;
    }
    const order = await Order.create({ userId, items: enrichedItems, totalAmount });
    axios.post(`${NOTIF_URL}/notify`, {
      type: 'ORDER_PLACED', userId,
      message: `Your order #${order._id} of $${totalAmount.toFixed(2)} has been placed!`
    }).catch(() => {});
    res.status(201).json(order);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Order service running on ${PORT}`));
