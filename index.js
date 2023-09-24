import express, { json } from "express";
import cors from "cors";
import { connect } from "./src/db/db.js";
import MyModel from "./src/models/MyModel.js";
import MyModelForTg from "./src/models/MyModelForTg.js";
import MyModelForWA from "./src/models/MyModelForWA.js";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";
import LiderDataModel from "./src/models/lider/liderData.js";
import bodyParser from "body-parser";
import MonacoDataModel from "./src/models/monaco/monacoData.js";
import FenixDataModel from "./src/models/fenix/fenixData.js";
import TuranDataModel from "./src/models/turan/turanData.js";

import SimModelLider from "./src/models/simcard/simlider.js";
import SimModelFenix from "./src/models/simcard/simfenix.js";
import SimModelTuran from "./src/models/simcard/simturan.js";
import SimModelMonaco from "./src/models/simcard/simmonaco.js";
import SimModelManager from "./src/models/simcard/simmanager.js";
import SimModelLiderLog from "./src/models/simcardlogist/liderlogist.js";
import SimModelMonacoLog from "./src/models/simcardlogist/monacologist.js";
import SimModelTuranLog from "./src/models/simcardlogist/turanlogist.js";
import SimModelFenixLog from "./src/models/simcardlogist/fenixlogist.js";
import UserForTeam from "./src/models/forRegist.js";
import TuranOtchetBetaModel from './src/models/turan/turanOtchetBeta.js'
import mongoose from "mongoose";
import liderOtchetBetaModel from "./src/models/lider/liderOtchetBeta.js";
import monacoOtchetBetaModel from "./src/models/monaco/monacoOtchetBeta.js";
import fenixOtchetBetaModel from "./src/models/fenix/fenixOtchetBeta.js";



const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

connect(); // Подключение к базе данных

app.post('/test/liderdatas', (req, res) => {
  const { date, otchet, itog } = req.body

  let data = {
    date: date,
    otchet: otchet.map(elem => ({
      _id: elem._id,
      sm: elem.sm,
      date: elem.date,
      sity: elem.sity,
      admin: elem.admin,
      buyer: elem.buyer,
      comPersent100: elem.comPersent100,
      comPersent2: elem.comPersent2,
      comPersent3: elem.comPersent3,
      comPersent4: elem.comPersent4,
      indexPersent100: elem.indexPersent100,
      indexPersent2: elem.indexPersent2,
      indexPersent3: elem.indexPersent3,
      indexPersent4: elem.indexPersent4,
      uhod: elem.uhod,
      prihod: elem.prihod,
      itog: elem.itog,
      itogIndex: elem.itogIndex
    })),

    itog: itog.map(elem => ({
      _id: elem._id,
      date: elem.date,
      ros1: elem.ros1,
      ros2: elem.ros2,
      ros3: elem.ros3,
      ros4: elem.ros4,
      ros5: elem.ros5,
      ros6: elem.ros6,
      ros7: elem.ros7,
      sum1: elem.sum1,
      sum2: elem.sum2,
      sum3: elem.sum3,
      sum4: elem.sum4,
      sum5: elem.sum5,
      sum6: elem.sum6,
      sum7: elem.sum7,
      upak: elem.upak,
      allItogIndex: elem.allItogIndex,
      allItog: elem.allItog,
      allItogUhod: elem.allItogUhod,
      allItogPrihod: elem.allItogPrihod,
      raznica: elem.raznica,
      itogs: elem.itogs
    }))
  };

  const liderData = new LiderDataModel(data);
  liderData.save()
    .then(() => {
      console.log('Данные успешно сохранены');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Ошибка при сохранении данных:', error);
      res.sendStatus(500);
    });
});

app.get('/test/liderdatas', async (req, res) => {
  try {
    const data = await LiderDataModel.find();
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/updateDatalider/:id', async (req, res) => {
  const { id } = req.params
  const { buyer } = req.body

  try {
    const updateDoc = await LiderDataModel.findOneAndUpdate(
      { "otchet._id": id },
      {
        "otchet.$.buyer": buyer,
      },
      { new: true }
    )

    if (!updateDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});


app.post('/test/monacodatas', (req, res) => {
  const { date, otchet, itog } = req.body

  let data = {
    date: date,
    otchet: otchet.map(elem => ({
      _id: elem._id,
      sm: elem.sm,
      date: elem.date,
      sity: elem.sity,
      admin: elem.admin,
      buyer: elem.buyer,
      comPersent100: elem.comPersent100,
      comPersent2: elem.comPersent2,
      comPersent3: elem.comPersent3,
      comPersent4: elem.comPersent4,
      indexPersent100: elem.indexPersent100,
      indexPersent2: elem.indexPersent2,
      indexPersent3: elem.indexPersent3,
      indexPersent4: elem.indexPersent4,
      uhod: elem.uhod,
      prihod: elem.prihod,
      itog: elem.itog,
      itogIndex: elem.itogIndex
    })),

    itog: itog.map(elem => ({
      _id: elem._id,
      date: elem.date,
      ros1: elem.ros1,
      ros2: elem.ros2,
      ros3: elem.ros3,
      ros4: elem.ros4,
      ros5: elem.ros5,
      ros6: elem.ros6,
      ros7: elem.ros7,
      sum1: elem.sum1,
      sum2: elem.sum2,
      sum3: elem.sum3,
      sum4: elem.sum4,
      sum5: elem.sum5,
      sum6: elem.sum6,
      sum7: elem.sum7,
      upak: elem.upak,
      allItogIndex: elem.allItogIndex,
      allItog: elem.allItog,
      allItogUhod: elem.allItogUhod,
      allItogPrihod: elem.allItogPrihod,
      raznica: elem.raznica,
      itogs: elem.itogs
    }))
  };

  const monacpData = new MonacoDataModel(data);
  monacpData.save()
    .then(() => {
      console.log('Данные успешно сохранены');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Ошибка при сохранении данных:', error);
      res.sendStatus(500);
    });
});

app.get('/test/monacodatas', async (req, res) => {
  try {
    const data = await MonacoDataModel.find();
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/updateDatamonaco/:id', async (req, res) => {
  const { id } = req.params
  const { buyer } = req.body

  try {
    const updateDoc = await MonacoDataModel.findOneAndUpdate(
      { "otchet._id": id },
      {
        "otchet.$.buyer": buyer,
      },
      { new: true }
    )

    if (!updateDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});



app.post('/test/fenixdatas', (req, res) => {
  const { date, otchet, itog } = req.body

  let data = {
    date: date,
    otchet: otchet.map(elem => ({
      _id: elem._id,
      sm: elem.sm,
      date: elem.date,
      sity: elem.sity,
      admin: elem.admin,
      buyer: elem.buyer,
      comPersent100: elem.comPersent100,
      comPersent2: elem.comPersent2,
      comPersent3: elem.comPersent3,
      comPersent4: elem.comPersent4,
      indexPersent100: elem.indexPersent100,
      indexPersent2: elem.indexPersent2,
      indexPersent3: elem.indexPersent3,
      indexPersent4: elem.indexPersent4,
      uhod: elem.uhod,
      prihod: elem.prihod,
      itog: elem.itog,
      itogIndex: elem.itogIndex
    })),

    itog: itog.map(elem => ({
      _id: elem._id,
      date: elem.date,
      ros1: elem.ros1,
      ros2: elem.ros2,
      ros3: elem.ros3,
      ros4: elem.ros4,
      ros5: elem.ros5,
      ros6: elem.ros6,
      ros7: elem.ros7,
      sum1: elem.sum1,
      sum2: elem.sum2,
      sum3: elem.sum3,
      sum4: elem.sum4,
      sum5: elem.sum5,
      sum6: elem.sum6,
      sum7: elem.sum7,
      upak: elem.upak,
      allItogIndex: elem.allItogIndex,
      allItog: elem.allItog,
      allItogUhod: elem.allItogUhod,
      allItogPrihod: elem.allItogPrihod,
      raznica: elem.raznica,
      itogs: elem.itogs
    }))
  };

  const fenixData = new FenixDataModel(data);
  fenixData.save()
    .then(() => {
      console.log('Данные успешно сохранены');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Ошибка при сохранении данных:', error);
      res.sendStatus(500);
    });
});

app.get('/test/fenixdatas', async (req, res) => {
  try {
    const data = await FenixDataModel.find();
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/updateDatafenix/:id', async (req, res) => {
  const { id } = req.params
  const { buyer } = req.body

  try {
    const updateDoc = await FenixDataModel.findOneAndUpdate(
      { "otchet._id": id },
      {
        "otchet.$.buyer": buyer,
      },
      { new: true }
    )

    if (!updateDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.post('/test/turandatas', (req, res) => {
  const { date, otchet, itog } = req.body

  let data = {
    date: date,
    otchet: otchet.map(elem => ({
      _id: elem._id,
      sm: elem.sm,
      date: elem.date,
      sity: elem.sity,
      admin: elem.admin,
      buyer: elem.buyer,
      comPersent100: elem.comPersent100,
      comPersent2: elem.comPersent2,
      comPersent3: elem.comPersent3,
      comPersent4: elem.comPersent4,
      indexPersent100: elem.indexPersent100,
      indexPersent2: elem.indexPersent2,
      indexPersent3: elem.indexPersent3,
      indexPersent4: elem.indexPersent4,
      uhod: elem.uhod,
      prihod: elem.prihod,
      itog: elem.itog,
      itogIndex: elem.itogIndex
    })),

    itog: itog.map(elem => ({
      _id: elem._id,
      date: elem.date,
      ros1: elem.ros1,
      ros2: elem.ros2,
      ros3: elem.ros3,
      ros4: elem.ros4,
      ros5: elem.ros5,
      ros6: elem.ros6,
      ros7: elem.ros7,
      sum1: elem.sum1,
      sum2: elem.sum2,
      sum3: elem.sum3,
      sum4: elem.sum4,
      sum5: elem.sum5,
      sum6: elem.sum6,
      sum7: elem.sum7,
      upak: elem.upak,
      allItogIndex: elem.allItogIndex,
      allItog: elem.allItog,
      allItogUhod: elem.allItogUhod,
      allItogPrihod: elem.allItogPrihod,
      raznica: elem.raznica,
      itogs: elem.itogs
    }))
  };

  const turanData = new TuranDataModel(data);
  turanData.save()
    .then(() => {
      console.log('Данные успешно сохранены');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Ошибка при сохранении данных:', error);
      res.sendStatus(500);
    });
});

app.get('/test/turandatas', async (req, res) => {
  try {
    const data = await TuranDataModel.find();
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/updateDataturan/:id', async (req, res) => {
  const { id } = req.params
  const { buyer } = req.body

  try {
    const updateDoc = await TuranDataModel.findOneAndUpdate(
      { "otchet._id": id },
      {
        "otchet.$.buyer": buyer,
      },
      { new: true }
    )

    if (!updateDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});




app.post('/newotchet/turanotchetbeta', async (req, res) => {
  try {
    const otchetArray = [];
    for (let i = 1; i <= 30; i++) {
      otchetArray.push({
        list: i,
        sm: 1,
        sity: '',
        admin: '',
        buyer: '',
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
        itog: 0,
        itogIndex: 0
      });
    }

    const newotchet = new TuranOtchetBetaModel({
      otchet: otchetArray,
      itog: [{
        ros1: '',
        ros2: '',
        ros3: '',
        ros4: '',
        ros5: '',
        sum1: 0,
        sum2: 0,
        sum3: 0,
        sum4: 0,
        sum5: 0,
        allItogIndex: 0,
        allItog: 0,
        allItogPrihod: 0,
        allItogUhod: 0,
        raznica: 0,
        itogs: 0
      }]
    });

    await newotchet.save();

    res.status(201).json({ message: 'Отчеты успешно созданы' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.patch('/update/turanotchetbetas/:id', async (req, res) => {
  const { id } = req.params;
  const {
    sm,
    sity,
    admin,
    buyer,
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
    itog,
    itogIndex,
    ros1,
    ros2,
    ros3,
    ros4,
    ros5,
    sum1,
    sum2,
    sum3,
    sum4,
    sum5,
    allItogIndex,
    allItog,
    allItogPrihod,
    allItogUhod,
    raznica,
    itogs
  } = req.body;

  try {
    const updatedDoc = await TuranOtchetBetaModel.findOneAndUpdate(
      { "otchet._id": id },
      {
        "otchet.$.sm": sm,
        "otchet.$.sity": sity,
        "otchet.$.admin": admin,
        "otchet.$.buyer": buyer,
        "otchet.$.comPersent100": comPersent100,
        "otchet.$.comPersent2": comPersent2,
        "otchet.$.comPersent3": comPersent3,
        "otchet.$.comPersent4": comPersent4,
        "otchet.$.indexPersent100": indexPersent100,
        "otchet.$.indexPersent2": indexPersent2,
        "otchet.$.indexPersent3": indexPersent3,
        "otchet.$.indexPersent4": indexPersent4,
        "otchet.$.uhod": uhod,
        "otchet.$.prihod": prihod,
        "otchet.$.itog": itog,
        "otchet.$.itogIndex": itogIndex,
        "otchet.$.itog.ros1": ros1,
        "otchet.$.itog.ros2": ros2,
        "otchet.$.itog.ros3": ros3,
        "otchet.$.itog.ros4": ros4,
        "otchet.$.itog.ros5": ros5,
        "otchet.$.itog.sum1": sum1,
        "otchet.$.itog.sum2": sum2,
        "otchet.$.itog.sum3": sum3,
        "otchet.$.itog.sum4": sum4,
        "otchet.$.itog.sum5": sum5,
        "otchet.$.itog.allItogIndex": allItogIndex,
        "otchet.$.itog.allItog": allItog,
        "otchet.$.itog.allItogPrihod": allItogPrihod,
        "otchet.$.itog.allItogUhod": allItogUhod,
        "otchet.$.itog.raznica": raznica,
        "otchet.$.itog.itogs": itogs
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.patch('/update/turanotchetbetasitog/:id', async (req, res) => {
  const { id } = req.params;
  const {
    ros1,
    ros2,
    ros3,
    ros4,
    ros5,
    sum1,
    sum2,
    sum3,
    sum4,
    sum5,
    allItogIndex,
    allItog,
    allItogPrihod,
    allItogUhod,
    raznica,
    itogs
  } = req.body;

  try {
    const updatedDoc = await TuranOtchetBetaModel.findOneAndUpdate(
      { "itog._id": id },
      {
        "itog.$.ros1": ros1,
        "itog.$.ros2": ros2,
        "itog.$.ros3": ros3,
        "itog.$.ros4": ros4,
        "itog.$.ros5": ros5,
        "itog.$.sum1": sum1,
        "itog.$.sum2": sum2,
        "itog.$.sum3": sum3,
        "itog.$.sum4": sum4,
        "itog.$.sum5": sum5,
        "itog.$.allItogIndex": allItogIndex,
        "itog.$.allItog": allItog,
        "itog.$.allItogPrihod": allItogPrihod,
        "itog.$.allItogUhod": allItogUhod,
        "itog.$.raznica": raznica,
        "itog.$.itogs": itogs
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.get('/test/turanotchetbeta', async (req, res) => {
  try {
    const data = await TuranOtchetBetaModel.find()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.delete('/test/turanotchetbeta', async (req, res) => {
  try {
    await TuranOtchetBetaModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});

app.post("/insert/turanotchetbeta", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await TuranOtchetBetaModel.findByIdAndUpdate(
      id,
      {
        $push: {
          otchet: [{
            list: 1,
            sm: 1,
            sity: '',
            admin: '',
            buyer: '',
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
            itog: 0,
            itogIndex: 0
          }]
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});




app.post('/newotchet/liderotchetbeta', async (req, res) => {
  try {
    const otchetArray = [];
    for (let i = 1; i <= 30; i++) {
      otchetArray.push({
        list: i,
        sm: 1,
        sity: '',
        admin: '',
        buyer: '',
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
        itog: 0,
        itogIndex: 0
      });
    }

    const newotchet = new liderOtchetBetaModel({
      otchet: otchetArray,
      itog: [{
        ros1: '',
        ros2: '',
        ros3: '',
        ros4: '',
        ros5: '',
        sum1: 0,
        sum2: 0,
        sum3: 0,
        sum4: 0,
        sum5: 0,
        allItogIndex: 0,
        allItog: 0,
        allItogPrihod: 0,
        allItogUhod: 0,
        raznica: 0,
        itogs: 0
      }]
    });

    await newotchet.save();

    res.status(201).json({ message: 'Отчеты успешно созданы' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.patch('/update/liderotchetbetas/:id', async (req, res) => {
  const { id } = req.params;
  const {
    sm,
    sity,
    admin,
    buyer,
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
    itog,
    itogIndex,
    ros1,
    ros2,
    ros3,
    ros4,
    ros5,
    sum1,
    sum2,
    sum3,
    sum4,
    sum5,
    allItogIndex,
    allItog,
    allItogPrihod,
    allItogUhod,
    raznica,
    itogs
  } = req.body;

  try {
    const updatedDoc = await liderOtchetBetaModel.findOneAndUpdate(
      { "otchet._id": id },
      {
        "otchet.$.sm": sm,
        "otchet.$.sity": sity,
        "otchet.$.admin": admin,
        "otchet.$.buyer": buyer,
        "otchet.$.comPersent100": comPersent100,
        "otchet.$.comPersent2": comPersent2,
        "otchet.$.comPersent3": comPersent3,
        "otchet.$.comPersent4": comPersent4,
        "otchet.$.indexPersent100": indexPersent100,
        "otchet.$.indexPersent2": indexPersent2,
        "otchet.$.indexPersent3": indexPersent3,
        "otchet.$.indexPersent4": indexPersent4,
        "otchet.$.uhod": uhod,
        "otchet.$.prihod": prihod,
        "otchet.$.itog": itog,
        "otchet.$.itogIndex": itogIndex,
        "otchet.$.itog.ros1": ros1,
        "otchet.$.itog.ros2": ros2,
        "otchet.$.itog.ros3": ros3,
        "otchet.$.itog.ros4": ros4,
        "otchet.$.itog.ros5": ros5,
        "otchet.$.itog.sum1": sum1,
        "otchet.$.itog.sum2": sum2,
        "otchet.$.itog.sum3": sum3,
        "otchet.$.itog.sum4": sum4,
        "otchet.$.itog.sum5": sum5,
        "otchet.$.itog.allItogIndex": allItogIndex,
        "otchet.$.itog.allItog": allItog,
        "otchet.$.itog.allItogPrihod": allItogPrihod,
        "otchet.$.itog.allItogUhod": allItogUhod,
        "otchet.$.itog.raznica": raznica,
        "otchet.$.itog.itogs": itogs
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.patch('/update/liderotchetbetasitog/:id', async (req, res) => {
  const { id } = req.params;
  const {
    ros1,
    ros2,
    ros3,
    ros4,
    ros5,
    sum1,
    sum2,
    sum3,
    sum4,
    sum5,
    allItogIndex,
    allItog,
    allItogPrihod,
    allItogUhod,
    raznica,
    itogs
  } = req.body;

  try {
    const updatedDoc = await liderOtchetBetaModel.findOneAndUpdate(
      { "itog._id": id },
      {
        "itog.$.ros1": ros1,
        "itog.$.ros2": ros2,
        "itog.$.ros3": ros3,
        "itog.$.ros4": ros4,
        "itog.$.ros5": ros5,
        "itog.$.sum1": sum1,
        "itog.$.sum2": sum2,
        "itog.$.sum3": sum3,
        "itog.$.sum4": sum4,
        "itog.$.sum5": sum5,
        "itog.$.allItogIndex": allItogIndex,
        "itog.$.allItog": allItog,
        "itog.$.allItogPrihod": allItogPrihod,
        "itog.$.allItogUhod": allItogUhod,
        "itog.$.raznica": raznica,
        "itog.$.itogs": itogs
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.get('/test/liderotchetbeta', async (req, res) => {
  try {
    const data = await liderOtchetBetaModel.find()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.delete('/test/liderotchetbeta', async (req, res) => {
  try {
    await liderOtchetBetaModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});

app.post("/insert/liderotchetbeta", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await liderOtchetBetaModel.findByIdAndUpdate(
      id,
      {
        $push: {
          otchet: [{
            list: 1,
            sm: 1,
            sity: '',
            admin: '',
            buyer: '',
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
            itog: 0,
            itogIndex: 0
          }]
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});



app.post('/newotchet/monacootchetbeta', async (req, res) => {
  try {
    const otchetArray = [];
    for (let i = 1; i <= 30; i++) {
      otchetArray.push({
        list: i,
        sm: 1,
        sity: '',
        admin: '',
        buyer: '',
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
        itog: 0,
        itogIndex: 0
      });
    }

    const newotchet = new monacoOtchetBetaModel({
      otchet: otchetArray,
      itog: [{
        ros1: '',
        ros2: '',
        ros3: '',
        ros4: '',
        ros5: '',
        sum1: 0,
        sum2: 0,
        sum3: 0,
        sum4: 0,
        sum5: 0,
        allItogIndex: 0,
        allItog: 0,
        allItogPrihod: 0,
        allItogUhod: 0,
        raznica: 0,
        itogs: 0
      }]
    });

    await newotchet.save();

    res.status(201).json({ message: 'Отчеты успешно созданы' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.patch('/update/monacootchetbetas/:id', async (req, res) => {
  const { id } = req.params;
  const {
    sm,
    sity,
    admin,
    buyer,
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
    itog,
    itogIndex,
    ros1,
    ros2,
    ros3,
    ros4,
    ros5,
    sum1,
    sum2,
    sum3,
    sum4,
    sum5,
    allItogIndex,
    allItog,
    allItogPrihod,
    allItogUhod,
    raznica,
    itogs
  } = req.body;

  try {
    const updatedDoc = await monacoOtchetBetaModel.findOneAndUpdate(
      { "otchet._id": id },
      {
        "otchet.$.sm": sm,
        "otchet.$.sity": sity,
        "otchet.$.admin": admin,
        "otchet.$.buyer": buyer,
        "otchet.$.comPersent100": comPersent100,
        "otchet.$.comPersent2": comPersent2,
        "otchet.$.comPersent3": comPersent3,
        "otchet.$.comPersent4": comPersent4,
        "otchet.$.indexPersent100": indexPersent100,
        "otchet.$.indexPersent2": indexPersent2,
        "otchet.$.indexPersent3": indexPersent3,
        "otchet.$.indexPersent4": indexPersent4,
        "otchet.$.uhod": uhod,
        "otchet.$.prihod": prihod,
        "otchet.$.itog": itog,
        "otchet.$.itogIndex": itogIndex,
        "otchet.$.itog.ros1": ros1,
        "otchet.$.itog.ros2": ros2,
        "otchet.$.itog.ros3": ros3,
        "otchet.$.itog.ros4": ros4,
        "otchet.$.itog.ros5": ros5,
        "otchet.$.itog.sum1": sum1,
        "otchet.$.itog.sum2": sum2,
        "otchet.$.itog.sum3": sum3,
        "otchet.$.itog.sum4": sum4,
        "otchet.$.itog.sum5": sum5,
        "otchet.$.itog.allItogIndex": allItogIndex,
        "otchet.$.itog.allItog": allItog,
        "otchet.$.itog.allItogPrihod": allItogPrihod,
        "otchet.$.itog.allItogUhod": allItogUhod,
        "otchet.$.itog.raznica": raznica,
        "otchet.$.itog.itogs": itogs
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.patch('/update/monacootchetbetasitog/:id', async (req, res) => {
  const { id } = req.params;
  const {
    ros1,
    ros2,
    ros3,
    ros4,
    ros5,
    sum1,
    sum2,
    sum3,
    sum4,
    sum5,
    allItogIndex,
    allItog,
    allItogPrihod,
    allItogUhod,
    raznica,
    itogs
  } = req.body;

  try {
    const updatedDoc = await monacoOtchetBetaModel.findOneAndUpdate(
      { "itog._id": id },
      {
        "itog.$.ros1": ros1,
        "itog.$.ros2": ros2,
        "itog.$.ros3": ros3,
        "itog.$.ros4": ros4,
        "itog.$.ros5": ros5,
        "itog.$.sum1": sum1,
        "itog.$.sum2": sum2,
        "itog.$.sum3": sum3,
        "itog.$.sum4": sum4,
        "itog.$.sum5": sum5,
        "itog.$.allItogIndex": allItogIndex,
        "itog.$.allItog": allItog,
        "itog.$.allItogPrihod": allItogPrihod,
        "itog.$.allItogUhod": allItogUhod,
        "itog.$.raznica": raznica,
        "itog.$.itogs": itogs
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.get('/test/monacootchetbeta', async (req, res) => {
  try {
    const data = await monacoOtchetBetaModel.find()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.delete('/test/monacootchetbeta', async (req, res) => {
  try {
    await monacoOtchetBetaModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});

app.post("/insert/monacootchetbeta", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await monacoOtchetBetaModel.findByIdAndUpdate(
      id,
      {
        $push: {
          otchet: [{
            list: 1,
            sm: 1,
            sity: '',
            admin: '',
            buyer: '',
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
            itog: 0,
            itogIndex: 0
          }]
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});


app.post('/newotchet/fenixotchetbeta', async (req, res) => {
  try {
    const otchetArray = [];
    for (let i = 1; i <= 30; i++) {
      otchetArray.push({
        list: i,
        sm: 1,
        sity: '',
        admin: '',
        buyer: '',
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
        itog: 0,
        itogIndex: 0
      });
    }

    const newotchet = new fenixOtchetBetaModel({
      otchet: otchetArray,
      itog: [{
        ros1: '',
        ros2: '',
        ros3: '',
        ros4: '',
        ros5: '',
        sum1: 0,
        sum2: 0,
        sum3: 0,
        sum4: 0,
        sum5: 0,
        allItogIndex: 0,
        allItog: 0,
        allItogPrihod: 0,
        allItogUhod: 0,
        raznica: 0,
        itogs: 0
      }]
    });

    await newotchet.save();

    res.status(201).json({ message: 'Отчеты успешно созданы' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.patch('/update/fenixotchetbetas/:id', async (req, res) => {
  const { id } = req.params;
  const {
    sm,
    sity,
    admin,
    buyer,
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
    itog,
    itogIndex,
    ros1,
    ros2,
    ros3,
    ros4,
    ros5,
    sum1,
    sum2,
    sum3,
    sum4,
    sum5,
    allItogIndex,
    allItog,
    allItogPrihod,
    allItogUhod,
    raznica,
    itogs
  } = req.body;

  try {
    const updatedDoc = await fenixOtchetBetaModel.findOneAndUpdate(
      { "otchet._id": id },
      {
        "otchet.$.sm": sm,
        "otchet.$.sity": sity,
        "otchet.$.admin": admin,
        "otchet.$.buyer": buyer,
        "otchet.$.comPersent100": comPersent100,
        "otchet.$.comPersent2": comPersent2,
        "otchet.$.comPersent3": comPersent3,
        "otchet.$.comPersent4": comPersent4,
        "otchet.$.indexPersent100": indexPersent100,
        "otchet.$.indexPersent2": indexPersent2,
        "otchet.$.indexPersent3": indexPersent3,
        "otchet.$.indexPersent4": indexPersent4,
        "otchet.$.uhod": uhod,
        "otchet.$.prihod": prihod,
        "otchet.$.itog": itog,
        "otchet.$.itogIndex": itogIndex,
        "otchet.$.itog.ros1": ros1,
        "otchet.$.itog.ros2": ros2,
        "otchet.$.itog.ros3": ros3,
        "otchet.$.itog.ros4": ros4,
        "otchet.$.itog.ros5": ros5,
        "otchet.$.itog.sum1": sum1,
        "otchet.$.itog.sum2": sum2,
        "otchet.$.itog.sum3": sum3,
        "otchet.$.itog.sum4": sum4,
        "otchet.$.itog.sum5": sum5,
        "otchet.$.itog.allItogIndex": allItogIndex,
        "otchet.$.itog.allItog": allItog,
        "otchet.$.itog.allItogPrihod": allItogPrihod,
        "otchet.$.itog.allItogUhod": allItogUhod,
        "otchet.$.itog.raznica": raznica,
        "otchet.$.itog.itogs": itogs
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }

    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.patch('/update/fenixotchetbetasitog/:id', async (req, res) => {
  const { id } = req.params;
  const {
    ros1,
    ros2,
    ros3,
    ros4,
    ros5,
    sum1,
    sum2,
    sum3,
    sum4,
    sum5,
    allItogIndex,
    allItog,
    allItogPrihod,
    allItogUhod,
    raznica,
    itogs
  } = req.body;

  try {
    const updatedDoc = await fenixOtchetBetaModel.findOneAndUpdate(
      { "itog._id": id },
      {
        "itog.$.ros1": ros1,
        "itog.$.ros2": ros2,
        "itog.$.ros3": ros3,
        "itog.$.ros4": ros4,
        "itog.$.ros5": ros5,
        "itog.$.sum1": sum1,
        "itog.$.sum2": sum2,
        "itog.$.sum3": sum3,
        "itog.$.sum4": sum4,
        "itog.$.sum5": sum5,
        "itog.$.allItogIndex": allItogIndex,
        "itog.$.allItog": allItog,
        "itog.$.allItogPrihod": allItogPrihod,
        "itog.$.allItogUhod": allItogUhod,
        "itog.$.raznica": raznica,
        "itog.$.itogs": itogs
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Элемент не найден' });
    }
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.get('/test/fenixotchetbeta', async (req, res) => {
  try {
    const data = await fenixOtchetBetaModel.find()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.delete('/test/fenixotchetbeta', async (req, res) => {
  try {
    await fenixOtchetBetaModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});

app.post("/insert/fenixotchetbeta", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await fenixOtchetBetaModel.findByIdAndUpdate(
      id,
      {
        $push: {
          otchet: [{
            list: 1,
            sm: 1,
            sity: '',
            admin: '',
            buyer: '',
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
            itog: 0,
            itogIndex: 0
          }]
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});





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

app.post("/test/logins", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Неправильное имя пользователя" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }
    const roles = await User.findOne({ username })

    res.status(200).json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

//***************************************** */

app.post("/test/loginforteam", async (req, res) => {
  try {
    const { fullName, username, password, team, role } = req.body;

    const existingUser = await UserForTeam.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь с таким именем уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new UserForTeam({ fullName, username, password: hashedPassword, team, role });
    await user.save();

    res.status(200).json({ message: "Регистрация прошла успешно" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});


app.post("/test/loginforteamin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserForTeam.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Неправильное имя пользователя" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }
    const roles = await UserForTeam.findOne({ username })

    res.status(200).json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

app.get("/test/loginforteams", async (req, res) => {
  try {
    const data = await UserForTeam.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что-то пошло не так" });
  }
});

app.delete('/test/loginforteams/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedUser = await UserForTeam.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.put('/test/loginforteams/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedUser = await UserForTeam.findByIdAndUpdate(userId, updatedData, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных пользователя' });
  }
});


//***sim card ******************************** */
//***sim card ******************************** */
//***sim card ******************************** */


app.post("/insert/simcards", async (req, res) => {
  try {
    const { curator } = req.body
    const newData = new SimModelLider({
      curator: curator,
      slot: [{
        num: 1,
        number: '',
        status: '1',
        buyer: '',
        personal_number: '',
        date_of_verification: '',
        days_since_verifiation: '',
        status_simCard: '1',
        physical_simCard: '1',
        registration: '',
        WAcod: '',
        TGcod: '',
      }]
    })
    await newData.save()
    res.status(200).json({ massage: `${JSON.stringify(newData)}` })
  } catch (error) {
    res.status(500).json({ massage: `${JSON.stringify(error)}` })
  }
})

app.post("/insert/slots", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await SimModelLider.findByIdAndUpdate(
      id,
      {
        $push: {
          slot: {
            num: 1,
            number: '',
            status: '1',
            buyer: '',
            personal_number: '',
            date_of_verification: '',
            days_since_verification: '',
            status_simCard: '1',
            physical_simCard: '1',
            registration: '',
            WAcod: '',
            TGcod: '',
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});

app.patch("/test/simCardLiders/:id", async (req, res) => {
  const { id } = req.params;
  const {
    number,
    status,
    buyer,
    personal_number,
    date_of_verification,
    days_since_verification,
    status_simCard,
    physical_simCard,
    registration,
    WAcod,
    TGcod,
  } = req.body
  try {
    const updateSimCard = await SimModelLider.findOneAndUpdate(
      { "slot._id": id },
      {
        "slot.$.number": number,
        "slot.$.status": status,
        "slot.$.buyer": buyer,
        "slot.$.personal_number": personal_number,
        "slot.$.date_of_verification": date_of_verification,
        "slot.$.days_since_verification": days_since_verification,
        "slot.$.status_simCard": status_simCard,
        "slot.$.physical_simCard": physical_simCard,
        "slot.$.registration": registration,
        "slot.$.WAcod": WAcod,
        "slot.$.TGcod": TGcod,
      },
      { new: true }
    )
    res.json(updateSimCard);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.get("/test/simCardLiders", async (req, res) => {
  try {
    const data = await SimModelLider.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/update/simcards', async (req, res) => {
  const { itemId, field, value, days_since_verification } = req.body;

  try {
    await SimModelLider.findOneAndUpdate(
      { "slot._id": itemId },
      { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


//***sim card ******************************** */

app.post("/insert/simcardfenix", async (req, res) => {
  try {
    const { curator } = req.body
    const newData = new SimModelFenix({
      curator: curator,
      slot: [{
        num: 1,
        number: '',
        status: '1',
        buyer: '',
        personal_number: '',
        date_of_verification: '',
        days_since_verifiation: '',
        status_simCard: '1',
        physical_simCard: '1',
        registration: '',
        WAcod: '',
        TGcod: '',
      }]
    })
    await newData.save()
    res.status(200).json({ massage: `${JSON.stringify(newData)}` })
  } catch (error) {
    res.status(500).json({ massage: `${JSON.stringify(error)}` })
  }
})

app.post("/insert/slotsFenix", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await SimModelFenix.findByIdAndUpdate(
      id,
      {
        $push: {
          slot: {
            num: 1,
            number: '',
            status: '1',
            buyer: '',
            personal_number: '',
            date_of_verification: '',
            days_since_verification: '',
            status_simCard: '1',
            physical_simCard: '1',
            registration: '',
            WAcod: '',
            TGcod: '',
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});





app.get("/test/simCardfenixes", async (req, res) => {
  try {
    const data = await SimModelFenix.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch("/test/simCardFenixes/:id", async (req, res) => {
  const { id } = req.params;
  const {
    number,
    status,
    buyer,
    personal_number,
    date_of_verification,
    days_since_verification,
    status_simCard,
    physical_simCard,
    registration,
    WAcod,
    TGcod,
  } = req.body
  try {
    const updateSimCard = await SimModelFenix.findOneAndUpdate(
      { "slot._id": id },
      {
        "slot.$.number": number,
        "slot.$.status": status,
        "slot.$.buyer": buyer,
        "slot.$.personal_number": personal_number,
        "slot.$.date_of_verification": date_of_verification,
        "slot.$.days_since_verification": days_since_verification,
        "slot.$.status_simCard": status_simCard,
        "slot.$.physical_simCard": physical_simCard,
        "slot.$.registration": registration,
        "slot.$.WAcod": WAcod,
        "slot.$.TGcod": TGcod,
      },
      { new: true }
    )
    res.json(updateSimCard);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/update/simcardfenix', async (req, res) => {
  const { itemId, field, value, days_since_verification } = req.body;

  try {
    await SimModelFenix.findOneAndUpdate(
      { "slot._id": itemId },
      { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//***sim card ******************************** */


app.post("/insert/simcardturan", async (req, res) => {
  try {
    const { curator } = req.body
    const newData = new SimModelTuran({
      curator: curator,
      slot: [{
        num: 1,
        number: '',
        status: '1',
        buyer: '',
        personal_number: '',
        date_of_verification: '',
        days_since_verifiation: '',
        status_simCard: '1',
        physical_simCard: '1',
        registration: '',
        WAcod: '',
        TGcod: '',
      }]
    })
    await newData.save()
    res.status(200).json({ massage: `${JSON.stringify(newData)}` })
  } catch (error) {
    res.status(500).json({ massage: `${JSON.stringify(error)}` })
  }
})

app.post("/insert/slotsTuran", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await SimModelTuran.findByIdAndUpdate(
      id,
      {
        $push: {
          slot: {
            num: 1,
            number: '',
            status: '1',
            buyer: '',
            personal_number: '',
            date_of_verification: '',
            days_since_verification: '',
            status_simCard: '1',
            physical_simCard: '1',
            registration: '',
            WAcod: '',
            TGcod: '',
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});



app.patch("/test/simCardTurans/:id", async (req, res) => {
  const { id } = req.params;
  const {
    number,
    status,
    buyer,
    personal_number,
    date_of_verification,
    days_since_verification,
    status_simCard,
    physical_simCard,
    registration,
    WAcod,
    TGcod,
  } = req.body
  try {
    const updateSimCard = await SimModelTuran.findOneAndUpdate(
      { "slot._id": id },
      {
        "slot.$.number": number,
        "slot.$.status": status,
        "slot.$.buyer": buyer,
        "slot.$.personal_number": personal_number,
        "slot.$.date_of_verification": date_of_verification,
        "slot.$.days_since_verification": days_since_verification,
        "slot.$.status_simCard": status_simCard,
        "slot.$.physical_simCard": physical_simCard,
        "slot.$.registration": registration,
        "slot.$.WAcod": WAcod,
        "slot.$.TGcod": TGcod,
      },
      { new: true }
    )
    res.json(updateSimCard);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.get("/test/simCardTurans", async (req, res) => {
  try {
    const data = await SimModelTuran.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/update/simcardturan', async (req, res) => {
  const { itemId, field, value, days_since_verification } = req.body;

  try {
    await SimModelTuran.findOneAndUpdate(
      { "slot._id": itemId },
      { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//***sim card ******************************** */

app.post("/insert/simcardMonacos", async (req, res) => {
  try {
    const { curator } = req.body
    const newData = new SimModelMonaco({
      curator: curator,
      slot: [{
        num: 1,
        number: '',
        status: '1',
        buyer: '',
        personal_number: '',
        date_of_verification: '',
        days_since_verifiation: '',
        status_simCard: '1',
        physical_simCard: '1',
        registration: '',
        WAcod: '',
        TGcod: '',
      }]
    })
    await newData.save()
    res.status(200).json({ massage: `${JSON.stringify(newData)}` })
  } catch (error) {
    res.status(500).json({ massage: `${JSON.stringify(error)}` })
  }
})

app.post("/insert/slotsMonacos", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await SimModelMonaco.findByIdAndUpdate(
      id,
      {
        $push: {
          slot: {
            num: 1,
            number: '',
            status: '1',
            buyer: '',
            personal_number: '',
            date_of_verification: '',
            days_since_verification: '',
            status_simCard: '1',
            physical_simCard: '1',
            registration: '',
            WAcod: '',
            TGcod: '',
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});





app.get("/test/simCardMonacos", async (req, res) => {
  try {
    const data = await SimModelMonaco.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch("/test/simCardMonacos/:id", async (req, res) => {
  const { id } = req.params;
  const {
    number,
    status,
    buyer,
    personal_number,
    date_of_verification,
    days_since_verification,
    status_simCard,
    physical_simCard,
    registration,
    WAcod,
    TGcod,
  } = req.body
  try {
    const updateSimCard = await SimModelMonaco.findOneAndUpdate(
      { "slot._id": id },
      {
        "slot.$.number": number,
        "slot.$.status": status,
        "slot.$.buyer": buyer,
        "slot.$.personal_number": personal_number,
        "slot.$.date_of_verification": date_of_verification,
        "slot.$.days_since_verification": days_since_verification,
        "slot.$.status_simCard": status_simCard,
        "slot.$.physical_simCard": physical_simCard,
        "slot.$.registration": registration,
        "slot.$.WAcod": WAcod,
        "slot.$.TGcod": TGcod,
      },
      { new: true }
    )
    res.json(updateSimCard);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/update/simcardmonacos', async (req, res) => {
  const { itemId, field, value, days_since_verification } = req.body;

  try {
    await SimModelMonaco.findOneAndUpdate(
      { "slot._id": itemId },
      { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/*-------------------------------------------------------------simcard---------------------------*/

app.post("/insert/simcardManagers", async (req, res) => {
  try {
    const { curator } = req.body
    const newData = new SimModelManager({
      curator: curator,
      slot: [{
        num: 1,
        number: '',
        status: '1',
        buyer: '',
        personal_number: '',
        date_of_verification: '',
        days_since_verifiation: '',
        status_simCard: '1',
        physical_simCard: '1',
        registration: '',
        WAcod: '',
        TGcod: '',
      }]
    })
    await newData.save()
    res.status(200).json({ massage: `${JSON.stringify(newData)}` })
  } catch (error) {
    res.status(500).json({ massage: `${JSON.stringify(error)}` })
  }
})

app.post("/insert/slotsManagers", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await SimModelManager.findByIdAndUpdate(
      id,
      {
        $push: {
          slot: {
            num: 1,
            number: '',
            status: '1',
            buyer: '',
            personal_number: '',
            date_of_verification: '',
            days_since_verification: '',
            status_simCard: '1',
            physical_simCard: '1',
            registration: '',
            WAcod: '',
            TGcod: '',
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});





app.get("/test/simcardmanagers", async (req, res) => {
  try {
    const data = await SimModelManager.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/update/simcardmanagers', async (req, res) => {
  const { itemId, field, value, days_since_verification } = req.body;

  try {
    await SimModelManager.findOneAndUpdate(
      { "slot._id": itemId },
      { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


/*------------simcard lider logist-----------------------------------------------------------------------------*/

app.post("/insert/simcardliderlog", async (req, res) => {
  try {
    const { curator } = req.body
    const newData = new SimModelLiderLog({
      curator: curator,
      slot: [{
        num: 1,
        number: '',
        status: '1',
        logist: '',
        personal_number: '',
        date_of_verification: '',
        days_since_verifiation: '',
        status_simCard: '1',
        physical_simCard: '1',
        registration: '',
        WAcod: '',
        TGcod: '',
      }]
    })
    await newData.save()
    res.status(200).json({ massage: `${JSON.stringify(newData)}` })
  } catch (error) {
    res.status(500).json({ massage: `${JSON.stringify(error)}` })
  }
})

app.post("/insert/slotliderlog", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await SimModelLiderLog.findByIdAndUpdate(
      id,
      {
        $push: {
          slot: {
            num: 1,
            number: '',
            status: '1',
            logist: '',
            personal_number: '',
            date_of_verification: '',
            days_since_verification: '',
            status_simCard: '1',
            physical_simCard: '1',
            registration: '',
            WAcod: '',
            TGcod: '',
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});





app.get("/test/simcardliderlogs", async (req, res) => {
  try {
    const data = await SimModelLiderLog.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/update/simCardLiderLogs', async (req, res) => {
  const { itemId, field, value, days_since_verification } = req.body;

  try {
    await SimModelLiderLog.findOneAndUpdate(
      { "slot._id": itemId },
      { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/*------------simcard monaco logist-----------------------------------------------------------------------------*/

app.post("/insert/simcardmonacolog", async (req, res) => {
  try {
    const { curator } = req.body
    const newData = new SimModelMonacoLog({
      curator: curator,
      slot: [{
        num: 1,
        number: '',
        status: '1',
        logist: '',
        personal_number: '',
        date_of_verification: '',
        days_since_verifiation: '',
        status_simCard: '1',
        physical_simCard: '1',
        registration: '',
        WAcod: '',
        TGcod: '',
      }]
    })
    await newData.save()
    res.status(200).json({ massage: `${JSON.stringify(newData)}` })
  } catch (error) {
    res.status(500).json({ massage: `${JSON.stringify(error)}` })
  }
})

app.post("/insert/slotmonacolog", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await SimModelMonacoLog.findByIdAndUpdate(
      id,
      {
        $push: {
          slot: {
            num: 1,
            number: '',
            status: '1',
            logist: '',
            personal_number: '',
            date_of_verification: '',
            days_since_verification: '',
            status_simCard: '1',
            physical_simCard: '1',
            registration: '',
            WAcod: '',
            TGcod: '',
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});





app.get("/test/simCardMonacoLogs", async (req, res) => {
  try {
    const data = await SimModelMonacoLog.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/update/simCardMonacoLogs', async (req, res) => {
  const { itemId, field, value, days_since_verification } = req.body;

  try {
    await SimModelMonacoLog.findOneAndUpdate(
      { "slot._id": itemId },
      { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/*------------simcard turan logist-----------------------------------------------------------------------------*/

app.post("/insert/simcardturanlog", async (req, res) => {
  try {
    const { curator } = req.body
    const newData = new SimModelTuranLog({
      curator: curator,
      slot: [{
        num: 1,
        number: '',
        status: '1',
        logist: '',
        personal_number: '',
        date_of_verification: '',
        days_since_verifiation: '',
        status_simCard: '1',
        physical_simCard: '1',
        registration: '',
        WAcod: '',
        TGcod: '',
      }]
    })
    await newData.save()
    res.status(200).json({ massage: `${JSON.stringify(newData)}` })
  } catch (error) {
    res.status(500).json({ massage: `${JSON.stringify(error)}` })
  }
})

app.post("/insert/slotturanlog", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await SimModelTuranLog.findByIdAndUpdate(
      id,
      {
        $push: {
          slot: {
            num: 1,
            number: '',
            status: '1',
            logist: '',
            personal_number: '',
            date_of_verification: '',
            days_since_verification: '',
            status_simCard: '1',
            physical_simCard: '1',
            registration: '',
            WAcod: '',
            TGcod: '',
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});





app.get("/test/simCardTuranLogs", async (req, res) => {
  try {
    const data = await SimModelTuranLog.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/update/simCardTuranLogs', async (req, res) => {
  const { itemId, field, value, days_since_verification } = req.body;

  try {
    await SimModelTuranLog.findOneAndUpdate(
      { "slot._id": itemId },
      { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/*------------simcard fenix logist-----------------------------------------------------------------------------*/

app.post("/insert/simcardfenixlog", async (req, res) => {
  try {
    const { curator } = req.body
    const newData = new SimModelFenixLog({
      curator: curator,
      slot: [{
        num: 1,
        number: '',
        status: '1',
        logist: '',
        personal_number: '',
        date_of_verification: '',
        days_since_verifiation: '',
        status_simCard: '1',
        physical_simCard: '1',
        registration: '',
        WAcod: '',
        TGcod: '',
      }]
    })
    await newData.save()
    res.status(200).json({ massage: `${JSON.stringify(newData)}` })
  } catch (error) {
    res.status(500).json({ massage: `${JSON.stringify(error)}` })
  }
})

app.post("/insert/slotfenixlog", async (req, res) => {
  try {
    const { id } = req.body;

    const newData = await SimModelFenixLog.findByIdAndUpdate(
      id,
      {
        $push: {
          slot: {
            num: 1,
            number: '',
            status: '1',
            logist: '',
            personal_number: '',
            date_of_verification: '',
            days_since_verification: '',
            status_simCard: '1',
            physical_simCard: '1',
            registration: '',
            WAcod: '',
            TGcod: '',
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert new slot" });
  }
});





app.get("/test/simCardFenixLogs", async (req, res) => {
  try {
    const data = await SimModelFenixLog.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.patch('/update/simCardFenixLogs', async (req, res) => {
  const { itemId, field, value, days_since_verification } = req.body;

  try {
    await SimModelFenixLog.findOneAndUpdate(
      { "slot._id": itemId },
      { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});