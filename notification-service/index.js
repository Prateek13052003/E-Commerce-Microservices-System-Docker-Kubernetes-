const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// In-memory log (in prod you'd use SendGrid/Twilio/SES)
const notifications = [];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));

app.post('/notify', (req, res) => {
  const { type, userId, message } = req.body;
  const notification = { id: Date.now(), type, userId, message, sentAt: new Date() };
  notifications.push(notification);
  console.log(`[NOTIFICATION] ${type} → user ${userId}: ${message}`);
  res.status(201).json(notification);
});

app.get('/user/:userId', (req, res) => {
  const userNotifs = notifications.filter(n => n.userId === req.params.userId);
  res.json(userNotifs);
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Notification service running on port ${PORT}`));
