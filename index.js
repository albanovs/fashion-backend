import express from 'express';
import cors from 'cors';
import { connect } from './src/db/db.js';
import authRoutes from './src/routes/authRoutes.js';
import telegramRoutes from './src/routes/telegramRoutes.js';
// import instagramRoutes from './src/routes/instagramRoutes.js';
import whatsappRoutes from './src/routes/whatsappRoutes.js';
import MyModel from './src/models/MyModel.js';

const app = express();
app.use(express.json());
app.use(cors());

connect(); // Подключение к базе данных

app.use('/test', authRoutes); // Маршруты аутентификации и регистрации
app.use('/test/telegramSlot', telegramRoutes); // Маршруты для слотов Telegram
// app.use('/test/mymodels', instagramRoutes); // Маршруты для модели MyModel
app.use('/test/whatsappSlot', whatsappRoutes); // Маршруты для модели MyModelForWA

app.post('/test/mymodels', async (req, res) => {
  try {
    const { account, num } = req.body;
    const myData = new MyModel({ account, num });
    await myData.save();
    res.status(200).json({ message: 'Данные успешно добавлены' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.patch('/test/mymodels/:id', async (req, res) => {
  const { id } = req.params;
  const { monako, lider, fenix, turan } = req.body;

  try {
    const updatedMyModel = await MyModel.findByIdAndUpdate(
      id,
      { monako, lider, fenix, turan },
      { new: true }
    );
    res.json(updatedMyModel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
app.post('/insert/account', async (req, res) => {
  try {
    for (var i = 1; i <= 5; i++) {
      const myData = new MyModel({
        'account': req.body.account,
        'num': i,
        'monako': '',
        'fenix': '',
        'lider': '',
        'turan': '',
      });
      await myData.save()
    }
    res.status(200).json({ massage: `${JSON.stringify(myData)}` });

  } catch (error) {
    res.status(500).json({ error: 'что то пошло не так!' });
  }
});

app.get('/test/mymodels', async (req, res) => {
  try {
    const data = await MyModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Что то пошло не так'
    })
  }
});


const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});