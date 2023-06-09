import express from 'express';
import cors from 'cors';
import { connect } from './src/db/db.js';
import MyModel from './src/models/MyModel.js';
import MyModelForTg from './src/models/MyModelForTg.js';
import MyModelForWA from './src/models/MyModelForWA.js';
import User from './src/models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(cors());

connect(); // Подключение к базе данных

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


app.post('/telegramslot', async (req, res) => {
  try {
    const { account, num } = req.body;
    const myData = new MyModelForTg({ account, num });
    await myData.save();
    res.status(200).json({ message: 'Данные успешно добавлены' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.patch('/test/telegramSlot/:id', async (req, res) => {
  const { id } = req.params;
  const { monako, lider, fenix, turan } = req.body;

  try {
    const updatedTelegram = await MyModelForTg.findByIdAndUpdate(
      id,
      { monako, lider, fenix, turan },
      { new: true }
    );
    res.json(updatedTelegram);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/insert/account', async (req, res) => {
  try {
    const { account } = req.body;

    for (let i = 1; i <= 10; i++) {
      const myData = new MyModelForTg({
        account,
        num: i,
        monako: '',
        fenix: '',
        lider: '',
        turan: '',
      });
      await myData.save();
    }

    res.status(200).json({ message: 'Слоты успешно созданы' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.get('/test/telegramSlot', async (req, res) => {
  try {
    const data = await MyModelForTg.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.post('/test/whatsappslot', async (req, res) => {
  try {
    const { account, num } = req.body;
    const myData = new MyModelForWA({ account, num });
    await myData.save();
    res.status(200).json({ message: 'Данные успешно добавлены' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.patch('/test/whatsappslot/:id', async (req, res) => {
  const { id } = req.params;
  const { monako, lider, fenix, turan } = req.body;

  try {
    const updatedWhatsapp = await MyModelForWA.findByIdAndUpdate(
      id,
      { monako, lider, fenix, turan },
      { new: true }
    );
    res.json(updatedWhatsapp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/insert/account', async (req, res) => {
  try {
    const { account } = req.body;

    for (let i = 1; i <= 20; i++) {
      const myData = new MyModelForWA({
        account,
        num: i,
        monako: '',
        fenix: '',
        lider: '',
        turan: '',
      });
      await myData.save();
    }

    res.status(200).json({ message: 'Слоты успешно созданы' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.get('/test/whatsappslot', async (req, res) => {
  try {
    const data = await MyModelForWA.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(200).json({ message: 'Регистрация прошла успешно' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

app.post('/logins', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Неправильное имя пользователя или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неправильное имя пользователя или пароль' });
    }

    const token = jwt.sign({ userId: user._id }, 'secret_key');

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
