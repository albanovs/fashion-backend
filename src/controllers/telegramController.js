import MyModelForTg from '../models/MyModelForTg.js';

export const addTelegramSlot = async (req, res) => {
  try {
    const { account, num } = req.body;
    const myData = new MyModelForTg({ account, num });
    await myData.save();
    res.status(200).json({ message: 'Данные успешно добавлены' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
};

export const updateTelegramSlot = async (req, res) => {
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
};

export const createTelegramSlots = async (req, res) => {
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
};

export const getTelegramSlots = async (req, res) => {
  try {
    const data = await MyModelForTg.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
};