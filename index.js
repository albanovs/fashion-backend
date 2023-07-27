import express, { json } from "express";
import cors from "cors";
import { connect } from "./src/db/db.js";
import MyModel from "./src/models/MyModel.js";
import MyModelForTg from "./src/models/MyModelForTg.js";
import MyModelForWA from "./src/models/MyModelForWA.js";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";
import LiderModel from "./src/models/lider/LiderOtchet.js";
import LiderDataModel from "./src/models/lider/liderData.js";
import bodyParser from "body-parser";
import LiderItogModel from "./src/models/lider/LiderItog.js";
import MonacoDataModel from "./src/models/monaco/monacoData.js";
import MonacoItogModel from "./src/models/turan/TuranItog.js";
import MonacoModel from "./src/models/monaco/MonacoOtchet.js";
import FenixDataModel from "./src/models/fenix/fenixData.js";
import FenixItogModel from "./src/models/fenix/FenixItog.js";
import FenixModel from "./src/models/fenix/FenixOtchet.js";
import TuranDataModel from "./src/models/turan/turanData.js";
import TuranItogModel from "./src/models/turan/TuranItog.js";
import TuranModel from "./src/models/turan/TuranOtchet.js";

import SimModelLider from "./src/models/simcard/simlider.js";
import SimModelFenix from "./src/models/simcard/simfenix.js";
import SimModelTuran from "./src/models/simcard/simturan.js";
import SimModelMonaco from "./src/models/simcard/simmonaco.js";
import SimModelManager from "./src/models/simcard/simmanager.js";
import SimModelLiderLog from "./src/models/simcardlogist/liderlogist.js";
import SimModelMonacoLog from "./src/models/simcardlogist/monacologist.js";
import SimModelTuranLog from "./src/models/simcardlogist/turanlogist.js";
import SimModelFenixLog from "./src/models/simcardlogist/fenixlogist.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

connect(); // Подключение к базе данных

/*-------------------------------------------------------------------------*/
/*---------------LIDER----------------------------------------------------------*/
/*-------------------------------------------------------------------------*/


app.post('/test/ochets', async (req, res) => {
  try {
    const {
      list,
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
      itogIndex
    } = req.body;

    const myData = new LiderModel({
      list,
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
      itogIndex
    });
    await myData.save();
    res.status(200).json({ massage: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что то пошло не так" });
  }
})

app.patch('/test/otchets/:id', async (req, res) => {
  const { id } = req.params;
  const {
    list,
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
    itogIndex
  } = req.body;

  try {
    const updatedDoc = await LiderModel.findByIdAndUpdate(
      id,
      {
        list,
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
        itogIndex
      },
      { new: true }
    );
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.post("/newotchet/otchets", async (req, res) => {
  try {
    for (let i = 1; i <= 50; i++) {
      const newDate = new LiderModel({
        list: i,
        sm: 0,
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
      })
      await newDate.save()

    }

    res.status(200).json({ message: JSON.stringify(newDate) });
  } catch (error) {
    res.status(500).json({ error: "Что-то пошло не так!" });
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

app.delete('/test/otchets', async (req, res) => {
  try {
    await LiderModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});


/*------------Itog---------------------------------------------------------------------*/
app.post('/test/lideritogs', async (req, res) => {
  try {
    const {
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
      itogs
    } = req.body

    const myData = new LiderItogModel({
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
      itogs
    });
    await myData.save();
    res.status(200).json({ massage: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что то пошло не так" });
  }
})

app.patch('/test/lideritogs/:id', async (req, res) => {
  const { id } = req.params;
  const {
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
    itogs
  } = req.body;

  try {
    const updatedDoc = await LiderItogModel.findByIdAndUpdate(
      id,
      {
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
        itogs
      },
      { new: true }
    );
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }

})

app.post('/newitog/lideritogs', async (req, res) => {
  try {
    const myData = new LiderItogModel({
      ros1: '',
      ros2: '',
      ros3: '',
      ros4: '',
      ros5: '',
      ros6: '',
      ros7: '',
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
      itogs: 0
    })
    await myData.save()
    res.status(200).json({ massage: `${JSON.stringify(myData)}` })
  } catch (error) {
    res.status(500).json({ error: "что то пошло не так!" });
  }
})

app.get("/test/lideritogs", async (req, res) => {
  try {
    const data = await LiderItogModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.delete('/test/lideritogs', async (req, res) => {
  try {
    await LiderItogModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});

/*----itog data-------------------------------------------------------------*/

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

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/*-------------------------------------------------------------------------*/
/*---------------MONACO----------------------------------------------------------*/
/*-------------------------------------------------------------------------*/


app.post('/test/monacoochets', async (req, res) => {
  try {
    const {
      list,
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
      itogIndex
    } = req.body;

    const myData = new MonacoModel({
      list,
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
      itogIndex
    });
    await myData.save();
    res.status(200).json({ massage: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что то пошло не так" });
  }
})

app.patch('/test/monacootchets/:id', async (req, res) => {
  const { id } = req.params;
  const {
    list,
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
    itogIndex
  } = req.body;

  try {
    const updatedDoc = await MonacoModel.findByIdAndUpdate(
      id,
      {
        list,
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
        itogIndex
      },
      { new: true }
    );
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.post("/newotchet/monacootchets", async (req, res) => {
  try {
    for (let i = 1; i <= 50; i++) {
      const newDate = new MonacoModel({
        list: i,
        sm: 0,
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
      })
      await newDate.save()

    }

    res.status(200).json({ message: JSON.stringify(newDate) });
  } catch (error) {
    res.status(500).json({ error: "Что-то пошло не так!" });
  }
});

app.get("/test/monacootchets", async (req, res) => {
  try {
    const data = await MonacoModel.find()
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
});

app.delete('/test/monacootchets', async (req, res) => {
  try {
    await MonacoModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});


/*------------Itog---------------------------------------------------------------------*/
app.post('/test/monacoitogs', async (req, res) => {
  try {
    const {
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
      itogs
    } = req.body

    const myData = new MonacoItogModel({
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
      itogs
    });
    await myData.save();
    res.status(200).json({ massage: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что то пошло не так" });
  }
})

app.patch('/test/monacoitogs/:id', async (req, res) => {
  const { id } = req.params;
  const {
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
    itogs
  } = req.body;

  try {
    const updatedDoc = await MonacoItogModel.findByIdAndUpdate(
      id,
      {
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
        itogs
      },
      { new: true }
    );
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }

})

app.post('/newitog/monacoitogs', async (req, res) => {
  try {
    const myData = new MonacoItogModel({
      ros1: '',
      ros2: '',
      ros3: '',
      ros4: '',
      ros5: '',
      ros6: '',
      ros7: '',
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
      itogs: 0
    })
    await myData.save()
    res.status(200).json({ massage: `${JSON.stringify(myData)}` })
  } catch (error) {
    res.status(500).json({ error: "что то пошло не так!" });
  }
})

app.get("/test/monacoitogs", async (req, res) => {
  try {
    const data = await MonacoItogModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.delete('/test/monacoitogs', async (req, res) => {
  try {
    await MonacoItogModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});

/*----itog data-------------------------------------------------------------*/

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

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/*-------------------------------------------------------------------------*/
/*---------------FENIX----------------------------------------------------------*/
/*-------------------------------------------------------------------------*/


app.post('/test/fenixochets', async (req, res) => {
  try {
    const {
      list,
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
      itogIndex
    } = req.body;

    const myData = new FenixModel({
      list,
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
      itogIndex
    });
    await myData.save();
    res.status(200).json({ massage: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что то пошло не так" });
  }
})

app.patch('/test/fenixotchets/:id', async (req, res) => {
  const { id } = req.params;
  const {
    list,
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
    itogIndex
  } = req.body;

  try {
    const updatedDoc = await FenixModel.findByIdAndUpdate(
      id,
      {
        list,
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
        itogIndex
      },
      { new: true }
    );
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.post("/newotchet/fenixotchets", async (req, res) => {
  try {
    for (let i = 1; i <= 50; i++) {
      const newDate = new FenixModel({
        list: i,
        sm: 0,
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
      })
      await newDate.save()

    }

    res.status(200).json({ message: JSON.stringify(newDate) });
  } catch (error) {
    res.status(500).json({ error: "Что-то пошло не так!" });
  }
});

app.get("/test/fenixotchets", async (req, res) => {
  try {
    const data = await FenixModel.find()
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
});

app.delete('/test/fenixotchets', async (req, res) => {
  try {
    await FenixModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});


/*------------Itog---------------------------------------------------------------------*/
app.post('/test/fenixitogs', async (req, res) => {
  try {
    const {
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
      itogs
    } = req.body

    const myData = new FenixItogModel({
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
      itogs
    });
    await myData.save();
    res.status(200).json({ massage: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что то пошло не так" });
  }
})

app.patch('/test/fenixitogs/:id', async (req, res) => {
  const { id } = req.params;
  const {
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
    itogs
  } = req.body;

  try {
    const updatedDoc = await FenixItogModel.findByIdAndUpdate(
      id,
      {
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
        itogs
      },
      { new: true }
    );
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }

})

app.post('/newitog/fenixitogs', async (req, res) => {
  try {
    const myData = new FenixItogModel({
      ros1: '',
      ros2: '',
      ros3: '',
      ros4: '',
      ros5: '',
      ros6: '',
      ros7: '',
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
      itogs: 0
    })
    await myData.save()
    res.status(200).json({ massage: `${JSON.stringify(myData)}` })
  } catch (error) {
    res.status(500).json({ error: "что то пошло не так!" });
  }
})

app.get("/test/fenixitogs", async (req, res) => {
  try {
    const data = await FenixItogModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.delete('/test/fenixitogs', async (req, res) => {
  try {
    await FenixItogModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});

/*----itog data-------------------------------------------------------------*/

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

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/*-------------------------------------------------------------------------*/
/*---------------TURAN----------------------------------------------------------*/
/*-------------------------------------------------------------------------*/


app.post('/test/turanotchets', async (req, res) => {
  try {
    const {
      list,
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
      itogIndex
    } = req.body;

    const myData = new TuranModel({
      list,
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
      itogIndex
    });
    await myData.save();
    res.status(200).json({ massage: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что то пошло не так" });
  }
})

app.patch('/test/turanotchets/:id', async (req, res) => {
  const { id } = req.params;
  const {
    list,
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
    itogIndex
  } = req.body;

  try {
    const updatedDoc = await TuranModel.findByIdAndUpdate(
      id,
      {
        list,
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
        itogIndex
      },
      { new: true }
    );
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }
});

app.post("/newotchet/turanotchets", async (req, res) => {
  try {
    for (let i = 1; i <= 50; i++) {
      const newDate = new TuranModel({
        list: i,
        sm: 0,
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
      })
      await newDate.save()

    }

    res.status(200).json({ message: JSON.stringify(newDate) });
  } catch (error) {
    res.status(500).json({ error: "Что-то пошло не так!" });
  }
});

app.get("/test/turanotchets", async (req, res) => {
  try {
    const data = await TuranModel.find()
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
});

app.delete('/test/turanotchets', async (req, res) => {
  try {
    await TuranModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});


/*------------Itog---------------------------------------------------------------------*/
app.post('/test/turanitogs', async (req, res) => {
  try {
    const {
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
      itogs
    } = req.body

    const myData = new TuranItogModel({
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
      itogs
    });
    await myData.save();
    res.status(200).json({ massage: "Данные успешно добавлены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Что то пошло не так" });
  }
})

app.patch('/test/turanitogs/:id', async (req, res) => {
  const { id } = req.params;
  const {
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
    itogs
  } = req.body;

  try {
    const updatedDoc = await TuranItogModel.findByIdAndUpdate(
      id,
      {
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
        itogs
      },
      { new: true }
    );
    res.json(updatedDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
  }

})

app.post('/newitog/turanitogs', async (req, res) => {
  try {
    const myData = new TuranItogModel({
      ros1: '',
      ros2: '',
      ros3: '',
      ros4: '',
      ros5: '',
      ros6: '',
      ros7: '',
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
      itogs: 0
    })
    await myData.save()
    res.status(200).json({ massage: `${JSON.stringify(myData)}` })
  } catch (error) {
    res.status(500).json({ error: "что то пошло не так!" });
  }
})

app.get("/test/turanitogs", async (req, res) => {
  try {
    const data = await TuranItogModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Что то пошло не так",
    });
  }
})

app.delete('/test/turanitogs', async (req, res) => {
  try {
    await TuranItogModel.deleteMany();
    res.status(200).json({ message: 'Коллекция успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
  }
});

/*----itog data-------------------------------------------------------------*/

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

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/


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
