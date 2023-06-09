import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
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
};
