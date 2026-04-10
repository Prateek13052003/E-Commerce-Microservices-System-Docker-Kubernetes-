const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

const USER_URL    = process.env.USER_SERVICE_URL    || 'http://user-service:3001';
const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const ORDER_URL   = process.env.ORDER_SERVICE_URL   || 'http://order-service:3003';
const NOTIF_URL   = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3004';

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway', timestamp: new Date() }));

app.use('/api/users',         createProxyMiddleware({ target: USER_URL,    changeOrigin: true, pathRewrite: { '^/api/users': '' } }));
app.use('/api/products',      createProxyMiddleware({ target: PRODUCT_URL, changeOrigin: true, pathRewrite: { '^/api/products': '' } }));
app.use('/api/orders',        createProxyMiddleware({ target: ORDER_URL,   changeOrigin: true, pathRewrite: { '^/api/orders': '' } }));
app.use('/api/notifications', createProxyMiddleware({ target: NOTIF_URL,   changeOrigin: true, pathRewrite: { '^/api/notifications': '' } }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
