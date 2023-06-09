import MyModelForWA from '../models/MyModelForWA.js';

export const addWhatsappSlot = async (req, res) => {
  try {
    const { account, num } = req.body;
    const myData = new MyModelForWA({ account, num });
    await myData.save();
    res.status(200).json({ message: 'Данные успешно добавлены' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
};

export const updateWhatsappSlot = async (req, res) => {
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
};

export const createWhatsappSlot = async (req, res) => {
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
};

export const getWhatsappSlots = async (req, res) => {
  try {
    const data = await MyModelForWA.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
};