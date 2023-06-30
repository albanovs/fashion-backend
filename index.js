import express, { json } from "express";
import cors from "cors";
import { connect } from "./src/db/db.js";
import MyModel from "./src/models/MyModel.js";
import MyModelForTg from "./src/models/MyModelForTg.js";
import MyModelForWA from "./src/models/MyModelForWA.js";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";
import LiderModel from "./src/models/LiderOtchet.js";
import LiderItogModel from "./src/models/LiderItog.js";
import MonacoItogModel from "./src/models/MonacoItog.js";

const app = express();
app.use(express.json());
app.use(cors());

connect(); // Подключение к базе данных

/*-------------------------------------------------------------------------*/


app.post('/test/ochet', async (req, res) => {
  try {
    const {
      list,
      sm,
      date,
      sity,
      admin,
      comPersent100,
      comPersent2,
      comPersent3,
      comPersent4,
      indexPersent100,
      indexPersent2,
      indexPersent3,
      indexPersent4,
      uhod,
      prihod,
      Otpravka,
      itog,
      itogIndex
    } = req.body;

    const myData = new LiderModel({
      list,
      sm,
      date,
      sity,
      admin,
      comPersent100,
      comPersent2,
      comPersent3,
      comPersent4,
      indexPersent100,
      indexPersent2,
      indexPersent3,
      indexPersent4,
      uhod,
      prihod,
      Otpravka,
      itog,
      itogIndex
    });
    await myData.save();
    res.status(200).json({ massage: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что то пошло не так" });
  }
})


app.patch("/test/otchet/:id", async (req, res) => {
  const { id } = req.params;
  const {
    sm,
    date,
    sity,
    admin,
    comPersent100,
    comPersent2,
    comPersent3,
    comPersent4,
    indexPersent100,
    indexPersent2,
    indexPersent3,
    indexPersent4,
    uhod,
    prihod,
    Otpravka,
    itog,
    itogIndex
  } = req.body;

  try {
    const updateLiderOtchet = await LiderModel.findByIdAndUpdate(
      id,
      {
        sm,
        date,
        sity,
        admin,
        comPersent100,
        comPersent2,
        comPersent3,
        comPersent4,
        indexPersent100,
        indexPersent2,
        indexPersent3,
        indexPersent4,
        uhod,
        prihod,
        Otpravka,
        itog,
        itogIndex
      },
      { new: true }
    );
    res.json(updateLiderOtchet)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/newotchet/otchet", async (req, res) => {
  try {
    for (var i = 1; i <= 5; i++) {
      const myData = new LiderModel({
        list: i,
        sm: 0,
        date: "",
        sity: "",
        admin: "",
        comPersent100: 0,
        comPersent2: 0,
        comPersent3: 0,
        comPersent4: 0,
        indexPersent100: 0,
        indexPersent2: 0,
        indexPersent3: 0,
        indexPersent4: 0,
        uhod: 0,
        prihod: 0,
        Otpravka: 0,
        itog: 0,
        itogIndex: 0
      });
      await myData.save();
    }
    res.status(200).json({ massage: `${JSON.stringify(myData)}` });
  } catch (error) {
    res.status(500).json({ error: "что то пошло не так!" });
  }
});

app.get("/test/otchets", async (req, res) => {
  try {
    const data = await LiderModel.find()
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
});

/*----------------------------------------------------------------Monaco Itog--------------------------------------------------------------------*/

app.post("/newitog/monacoitogs", async (req, res) => {
  try {
    const myData = new MonacoItogModel({
      date: "",
      ros1: "",
      ros2: "",
      ros3: "",
      ros4: "",
      ros5: "",
      ros6: "",
      ros7: "",
      sum1: 0,
      sum2: 0,
      sum3: 0,
      sum4: 0,
      sum5: 0,
      sum6: 0,
      sum7: 0,
      upak: 0,
      allItogIndex: 0,
      allItog: 0,
      allItogPrihod: 0,
      allItogUhod: 0,
      raznica: 0,
      itog: 0
    })

    await myData.save()
    res.status(200).json({ massage: `${JSON.stringify(myData)}` });
  } catch (error) {
    res.status(500).json({ error: "что то пошло не так!" });

  }
})

/*-----------------------------------------------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------Lider Itog---------------------------------------------------------------------*/

app.post("/newitog/lideritogs", async (req, res) => {
  try {
    const myData = new LiderItogModel({
      date: "",
      ros1: "",
      ros2: "",
      ros3: "",
      ros4: "",
      ros5: "",
      ros6: "",
      ros7: "",
      sum1: 0,
      sum2: 0,
      sum3: 0,
      sum4: 0,
      sum5: 0,
      sum6: 0,
      sum7: 0,
      upak: 0,
      allItogIndex: 0,
      allItog: 0,
      allItogPrihod: 0,
      allItogUhod: 0,
      raznica: 0,
      itog: 0
    })

    await myData.save()
    res.status(200).json({ massage: `${JSON.stringify(myData)}` });
  } catch (error) {
    res.status(500).json({ error: "что то пошло не так!" });
  }
})


app.patch("/test/lideritogs/:id", async (req, res) => {
  const { id } = req.params;
  const {
    date,
    ros1,
    ros2,
    ros3,
    ros4,
    ros5,
    ros6,
    ros7,
    sum1,
    sum2,
    sum3,
    sum4,
    sum5,
    sum6,
    sum7,
    upak,
    allItogIndex,
    allItog,
    allItogPrihod,
    allItogUhod,
    raznica,
    itog
  } = req.body;

  try {
    const updateLiderItog = await LiderItogModel.findByIdAndUpdate(
      id,
      {
        date,
        ros1,
        ros2,
        ros3,
        ros4,
        ros5,
        ros6,
        ros7,
        sum1,
        sum2,
        sum3,
        sum4,
        sum5,
        sum6,
        sum7,
        upak,
        allItogIndex,
        allItog,
        allItogPrihod,
        allItogUhod,
        raznica,
        itog
      },
      { new: true }
    );
    res.json(updateLiderItog)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/test/lideritogs", async (req, res) => {
  try {
    const data = await LiderItogModel.find()
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так"
    });
  }
})

app.post('/test/lideritogsup', async (req, res) => {
  const initialInputValues2 = req.body;
  await LiderItogModel.findById(req.params)
    .then(LiderItogModel => {
      LiderItogModel.allItogIndex = initialInputValues2.allItogIndex;
      return LiderItogModel.save();
    })
    .then(updatedLideritog => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});



/*-------------------------------------------------------------------------*/

app.post("/test/mymodels", async (req, res) => {
  try {
    const { account, num } = req.body;
    const myData = new MyModel({ account, num });
    await myData.save();
    res.status(200).json({ message: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.patch("/test/mymodels/:id", async (req, res) => {
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
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/insert/account", async (req, res) => {
  try {
    for (var i = 1; i <= 5; i++) {
      const myData = new MyModel({
        account: req.body.account,
        num: i,
        monako: "",
        fenix: "",
        lider: "",
        turan: "",
      });
      await myData.save();
    }
    res.status(200).json({ massage: `${JSON.stringify(myData)}` });
  } catch (error) {
    res.status(500).json({ error: "что то пошло не так!" });
  }
});

app.get("/test/mymodels", async (req, res) => {
  try {
    const data = await MyModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
});

app.post("/telegramslot", async (req, res) => {
  try {
    const { account, num } = req.body;
    const myData = new MyModelForTg({ account, num });
    await myData.save();
    res.status(200).json({ message: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.patch("/test/telegramSlot/:id", async (req, res) => {
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
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/insert/telegram", async (req, res) => {
  try {
    const { account } = req.body;

    for (let i = 1; i <= 20; i++) {
      const myData = new MyModelForTg({
        account,
        num: i,
        monako: "",
        fenix: "",
        lider: "",
        turan: "",
      });
      await myData.save();
    }

    res.status(200).json({ message: "Слоты успешно созданы" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.get("/test/telegramSlot", async (req, res) => {
  try {
    const data = await MyModelForTg.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.post("/test/whatsappslot", async (req, res) => {
  try {
    const { account, num } = req.body;
    const myData = new MyModelForWA({ account, num });
    await myData.save();
    res.status(200).json({ message: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.patch("/test/whatsappslot/:id", async (req, res) => {
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
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/insert/account", async (req, res) => {
  try {
    const { account } = req.body;

    for (let i = 1; i <= 20; i++) {
      const myData = new MyModelForWA({
        account,
        num: i,
        monako: "",
        fenix: "",
        lider: "",
        turan: "",
      });
      await myData.save();
    }

    res.status(200).json({ message: "Слоты успешно созданы" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.get("/test/whatsappslot", async (req, res) => {
  try {
    const data = await MyModelForWA.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

/*------------------------------------------------------------------------------------*/

// app.post("/test/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "Пользователь с таким именем уже существует" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ username, password: hashedPassword, role });
//     await user.save();

//     res.status(200).json({ message: "Регистрация прошла успешно" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Что-то пошло не так" });
//   }
// });

app.post("/test/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь с таким именем уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    res.status(200).json({ message: "Регистрация прошла успешно" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

/*-------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------*/

app.post("/test/logins", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Неправильное имя пользователя" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    // user.role = role; // Добавление роли к пользователю
    // await user.save(); // Сохранение обновленных данных пользователя

    const roles = await User.findOne({ username })

    // const token = jwt.sign({ userId: user._id }, "secret_key");

    res.status(200).json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});



// app.post("/test/logins", async (req, res) => {
//   try {
//     const { username, password, role } = req.body;

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ message: "Неправильное имя пользователя" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Неверный пароль" });
//     }

//     const token = jwt.sign({ userId: user._id }, "secret_key");

//     res.status(200).json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Что-то пошло не так" });
//   }
// });


const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
