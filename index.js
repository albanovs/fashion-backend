import express from 'express';
import cors from 'cors';
import { connect } from './src/db/db.js';
import authRoutes from './src/routes/authRoutes.js';
import telegramRoutes from './src/routes/telegramRoutes.js';
import instagramRoutes from './src/routes/instagramRoutes.js';
import whatsappRoutes from './src/routes/whatsappRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

connect(); // Подключение к базе данных

app.use('/test', authRoutes); // Маршруты аутентификации и регистрации
app.use('/test/telegramSlot', telegramRoutes); // Маршруты для слотов Telegram
app.use('/test/mymodels', instagramRoutes); // Маршруты для модели MyModel
app.use('/test/whatsappSlot', whatsappRoutes); // Маршруты для модели MyModelForWA

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});