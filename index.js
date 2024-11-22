// import express from "express";
// import cors from "cors";
// import { connect } from "./src/db/db.js";
// import MyModel from "./src/models/MyModel.js";
// import MyModelForTg from "./src/models/MyModelForTg.js";
// import MyModelForWA from "./src/models/MyModelForWA.js";
// import User from "./src/models/User.js";
// import bcrypt from "bcrypt";
// import bodyParser from "body-parser";
// import SimModelManager from "./src/models/simcard/simmanager.js";

// import liderDataRouter from './src/routes/lider/liderDatasRouter.mjs'
// import liderOtchetBetaRouter from './src/routes/lider/otchetBetaRoutes.mjs'
// import simbuyerLiderRouter from './src/routes/lider/simbuyerLiderRouter.mjs'
// import liderSimLogistRouter from './src/routes/lider/liderLogistRouter.mjs'
 
// import monacoDataRouter from './src/routes/monaco/monacoDatasRouter.mjs'
// import monacoOtchetBetaRouter from './src/routes/monaco/monacoOtchetRouter.mjs'
// import simbuyerMonacoRouter from './src/routes/monaco/simbuyerMonacoRouter.mjs'
// import monacoSimLogistRouter from './src/routes/monaco/monacoLogistRouter.mjs'

// import fenixDataRouter from './src/routes/fenix/fenixDatasRouter.mjs'
// import fenixOtchetBetaRouter from './src/routes/fenix/fenixOtchetRouter.mjs'
// import simbuyerFenixRouter from './src/routes/fenix/simbuyerFenixRouter.mjs'
// import fenixSimLogistRouter from './src/routes/fenix/fenixLogistRouter.mjs'

// import turanDataRouter from './src/routes/turan/turanDatasRouter.mjs'
// import turanOtchetBetaRouter from './src/routes/turan/turanOtchetRouter.mjs'
// import simbuyerTuranRouter from './src/routes/turan/simbuyerTuranRouter.mjs'
// import turanSimLogistRouter from './src/routes/turan/turanLogistRouter.mjs'

// import newotdelDataRouter from './src/routes/newotdel/newotdelDatasRouter.mjs'
// import newotdelOtchetBetaRouter from './src/routes/newotdel/newotdelotchetBetaRoutes.mjs'
// import simbuyernewotdelRouter from './src/routes/newotdel/simbuyerNewotdelRouter.mjs'
// import newotdelSimLogistRouter from './src/routes/newotdel/newotdelLogistRouter.mjs'

// import libertyDataRouter from './src/routes/liberty/libertyDatasRouter.mjs'
// import libertyOtchetBetaRouter from './src/routes/liberty/libertyotchetBetaRoutes.mjs'
// import simbuyerlibertyRouter from './src/routes/liberty/simbuyerLibertyRouter.mjs'
// import libertySimLogistRouter from './src/routes/liberty/libertyLogistRouter.mjs'

// import calcliderManager from './src/routes/calculate/lider.mjs'
// import calcMonacoManager from './src/routes/calculate/monaco.mjs'
// import calcTuranManager from './src/routes/calculate/turan.mjs'
// import calcFenixManager from './src/routes/calculate/fenix.mjs'
// import calcNewOtdelManager from './src/routes/calculate/newotdel.mjs'
// import calcLibertyManager from './src/routes/calculate/liberty.mjs'

// import calcliderLog from './src/routes/calculate-logist/lider.mjs'
// import calcMonacoLog from './src/routes/calculate-logist/monaco.mjs'
// import calcTuranLog from './src/routes/calculate-logist/turan.mjs'
// import calcFenixLog from './src/routes/calculate-logist/fenix.mjs'
// import calcNewOtdelLog from './src/routes/calculate-logist/newOtdel.mjs'
// import calcLibertyLog from './src/routes/calculate-logist/liberty.mjs'

// import itogs from './src/routes/calculate-itog/itog.mjs'
// import clientLeader from './src/routes/client-privlechennyi/client-lider.mjs'
// import clientMonaco from './src/routes/client-privlechennyi/client-monaco.mjs'
// import clientTuran from './src/routes/client-privlechennyi/client-turan.mjs'
// import clientFenix from './src/routes/client-privlechennyi/client-fenix.mjs'
// import clientNewOtdel from './src/routes/client-privlechennyi/client-newotdel.mjs'
// import clientLiberty from './src/routes/client-privlechennyi/client-liberty.mjs'

// import fullfilment1 from './src/routes/fullfilment/fullfilment-1.mjs'

// import getManagers from './src/routes/managers/getmanager.mjs'
// import adminLogistraiting from './src/routes/calculate-logist/adminlogist.mjs'

// import itotdel from './src/routes/it/simcard.mjs'
// import bot from './src/controllers/telegram-bot/schet-faktura.mjs';
// import cron from 'node-cron'
// import updateCalcManager from "./src/controllers/calculate/calc-raaiting-month/calc-manager.mjs";
// import getManagersRait from './src/routes/calculate/calcraiting.mjs'
// import schetfactura from './src/routes/schetfactura/schetfactura.mjs'
// // import setExpenses from './src/controllers/expences/expences.mjs'
// import logistadmin from './src/routes/logistandadmin/logistandadmin.mjs'
// import calculateadminlogist from "./src/controllers/calculate-adminlogist/calculateadminlogist.mjs";
// import stadmins from './src/controllers/calculate/calc-raaiting-month/calc-st_admin.mjs'

// import incoming from './src/routes/incoming-outgoing/incoming.mjs'
// import outgoing from './src/routes/incoming-outgoing/outgoing.mjs'

// import raitingManager from './src/routes/raitings/manager.mjs'
// import createMonthlyReport from './src/controllers/raiting/manager.mjs'

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json())
// // bot.launch()

// // cron.schedule('*/10 * * * *', async () => {
// //   bot.launch()
// // })

// cron.schedule('0 0 1 * *', () => {
//   createMonthlyReport.createMonthlyReport();
// });

// createMonthlyReport.createMonthlyReport();

// connect();

// app.use('/', raitingManager)

// app.use('/', incoming)
// app.use('/', outgoing)

// app.use('/', logistadmin)
// app.use('/', adminLogistraiting)

// app.use('/', getManagers)
// app.use('/', getManagersRait)
// app.use('/', schetfactura)

// app.use('/', liderDataRouter)
// app.use('/', liderOtchetBetaRouter)
// app.use('/', simbuyerLiderRouter)
// app.use('/', liderSimLogistRouter)

// app.use('/', monacoDataRouter)
// app.use('/', monacoOtchetBetaRouter)
// app.use('/', simbuyerMonacoRouter)
// app.use('/', monacoSimLogistRouter)

// app.use('/', fenixDataRouter)
// app.use('/', fenixOtchetBetaRouter)
// app.use('/', fenixSimLogistRouter)
// app.use('/', simbuyerFenixRouter)

// app.use('/', turanDataRouter)
// app.use('/', turanOtchetBetaRouter)
// app.use('/', turanSimLogistRouter)
// app.use('/', simbuyerTuranRouter)

// app.use('/', newotdelDataRouter)
// app.use('/', newotdelOtchetBetaRouter)
// app.use('/', simbuyernewotdelRouter)
// app.use('/', newotdelSimLogistRouter)

// app.use('/', libertyDataRouter)
// app.use('/', libertyOtchetBetaRouter)
// app.use('/', simbuyerlibertyRouter)
// app.use('/', libertySimLogistRouter)

// app.use('/', calcliderManager)
// app.use('/', calcMonacoManager)
// app.use('/', calcTuranManager)
// app.use('/', calcFenixManager)
// app.use('/', calcNewOtdelManager)
// app.use('/', calcLibertyManager)

// app.use('/', calcliderLog)
// app.use('/', calcMonacoLog)
// app.use('/', calcTuranLog)
// app.use('/', calcFenixLog)
// app.use('/', calcNewOtdelLog)
// app.use('/', calcLibertyLog)

// app.use('/', itogs)
// app.use('/', clientLeader)
// app.use('/', clientMonaco)
// app.use('/', clientFenix)
// app.use('/', clientTuran)
// app.use('/', clientNewOtdel)
// app.use('/', clientLiberty)

// app.use('/', fullfilment1)

// app.use('/', itotdel)


// app.post("/test/mymodels", async (req, res) => {
//   try {
//     const { account, num } = req.body;
//     const myData = new MyModel({ account, num });
//     await myData.save();
//     res.status(200).json({ message: "Данные успешно добавлены" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Что-то пошло не так" });
//   }
// });

// app.patch("/test/mymodels/:id", async (req, res) => {
//   const { id } = req.params;
//   const { monako, lider, fenix, turan, liberty, fbox } = req.body;

//   try {
//     const updatedMyModel = await MyModel.findByIdAndUpdate(
//       id,
//       { monako, lider, fenix, turan, liberty, fbox },
//       { new: true }
//     );
//     res.json(updatedMyModel);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Ошибка сервера" });
//   }
// });

// app.post("/insert/account", async (req, res) => {
//   try {
//     const myData = new MyModel({
//       account: req.body.account,
//       num: 1,
//       monako: "",
//       fenix: "",
//       lider: "",
//       turan: "",
//       liberty: "",
//       fbox: ""
//     });
//     await myData.save();
//     res.status(200).json({ massage: `${JSON.stringify(myData)}` });
//   } catch (error) {
//     res.status(500).json({ error: "что то пошло не так!" });
//   }
// });

// app.get("/test/mymodels", async (req, res) => {
//   try {
//     const data = await MyModel.find();
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({
//       error: "Что то пошло не так",
//     });
//   }
// });

// app.post("/telegramslot", async (req, res) => {
//   try {
//     const { account, num } = req.body;
//     const myData = new MyModelForTg({ account, num });
//     await myData.save();
//     res.status(200).json({ message: "Данные успешно добавлены" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Что-то пошло не так" });
//   }
// });

// app.patch("/test/telegramSlot/:id", async (req, res) => {
//   const { id } = req.params;
//   const { monako, lider, fenix, turan, liberty, fbox } = req.body;

//   try {
//     const updatedTelegram = await MyModelForTg.findByIdAndUpdate(
//       id,
//       { monako, lider, fenix, turan, liberty, fbox },
//       { new: true }
//     );
//     res.json(updatedTelegram);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Ошибка сервера" });
//   }
// });

// app.post("/insert/telegram", async (req, res) => {
//   try {
//     const { account } = req.body;

//     for (let i = 1; i <= 20; i++) {
//       const myData = new MyModelForTg({
//         account,
//         num: i,
//         monako: "",
//         fenix: "",
//         lider: "",
//         turan: "",
//         liberty: "",
//         fbox: ""
//       });
//       await myData.save();
//     }

//     res.status(200).json({ message: "Слоты успешно созданы" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Что-то пошло не так" });
//   }
// });
// app.get("/test/telegramSlot", async (req, res) => {
//   try {
//     const data = await MyModelForTg.find().sort({ account: 1, num: 1 });
//     res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Что-то пошло не так" });
//   }
// });

// app.post("/test/whatsappslot", async (req, res) => {
//   try {
//     const { account, num } = req.body;
//     const myData = new MyModelForWA({ account, num });
//     await myData.save();
//     res.status(200).json({ message: "Данные успешно добавлены" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Что-то пошло не так" });
//   }
// });

// app.patch("/test/whatsappslot/:id", async (req, res) => {
//   const { id } = req.params;
//   const { monako, lider, fenix, turan, newOtdel } = req.body;

//   try {
//     const updatedWhatsapp = await MyModelForWA.findByIdAndUpdate(
//       id,
//       { monako, lider, fenix, turan, newOtdel },
//       { new: true }
//     );
//     res.json(updatedWhatsapp);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Ошибка сервера" });
//   }
// });

// app.post("/insert/account", async (req, res) => {
//   try {
//     const { account } = req.body;

//     for (let i = 1; i <= 20; i++) {
//       const myData = new MyModelForWA({
//         account,
//         num: i,
//         monako: "",
//         fenix: "",
//         lider: "",
//         turan: "",
//         liberty: "",
//         fbox: ""
//       });
//       await myData.save();
//     }

//     res.status(200).json({ message: "Слоты успешно созданы" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Что-то пошло не так" });
//   }
// });

// app.get("/test/whatsappslot", async (req, res) => {
//   try {
//     const data = await MyModelForWA.find();
//     res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Что-то пошло не так" });
//   }
// });

// // ------------------------------------------------------ logins ------------------------------------//

// app.post("/test/logins", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ message: "Неправильное имя пользователя" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Неверный пароль" });
//     }
//     const roles = await User.findOne({ username })

//     res.status(200).json({ roles });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Что-то пошло не так" });
//   }
// });

// app.get('/test/logins', async (req, res) => {
//   try {
//     const data = await User.find()
//     res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Что-то пошло не так" });
//   }
// })

// app.post("/test/register", async (req, res) => {
//   try {
//     const { username, password, role } = req.body;

//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: "Пользователь с таким именем уже существует" });
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

// app.delete('/test/login/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await User.findByIdAndDelete(id);
//     res.status(200).json({ message: "Пользователь успешно удален" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Что-то пошло не так" });
//   }
// });


// /*-------------------------------------------------------------simcard---------------------------*/

// app.post("/insert/simcardManagers", async (req, res) => {
//   try {
//     const { curator } = req.body
//     const newData = new SimModelManager({
//       curator: curator,
//       slot: [{
//         num: 1,
//         number: '',
//         status: '1',
//         buyer: '',
//         personal_number: '',
//         date_of_verification: '',
//         days_since_verifiation: '',
//         status_simCard: '1',
//         physical_simCard: '1',
//         registration: '',
//         WAcod: '',
//         TGcod: '',
//       }]
//     })
//     await newData.save()
//     res.status(200).json({ massage: `${JSON.stringify(newData)}` })
//   } catch (error) {
//     res.status(500).json({ massage: `${JSON.stringify(error)}` })
//   }
// })

// app.post("/insert/slotsManagers", async (req, res) => {
//   try {
//     const { id } = req.body;

//     const newData = await SimModelManager.findByIdAndUpdate(
//       id,
//       {
//         $push: {
//           slot: {
//             num: 1,
//             number: '',
//             status: '1',
//             buyer: '',
//             personal_number: '',
//             date_of_verification: '',
//             days_since_verification: '',
//             status_simCard: '1',
//             physical_simCard: '1',
//             registration: '',
//             WAcod: '',
//             TGcod: '',
//           }
//         }
//       },
//       { new: true }
//     );

//     res.status(200).json({ newData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to insert new slot" });
//   }
// });

// app.get("/test/simcardmanagers", async (req, res) => {
//   try {
//     const data = await SimModelManager.find();
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({
//       error: "Что то пошло не так",
//     });
//   }
// })

// app.patch("/test/simcardmanagers/:id", async (req, res) => {
//   const { id } = req.params;
//   const {
//     number,
//     status,
//     buyer,
//     personal_number,
//     date_of_verification,
//     days_since_verification,
//     status_simCard,
//     physical_simCard,
//     registration,
//     WAcod,
//     TGcod,
//   } = req.body
//   try {
//     const updateSimCard = await SimModelManager.findOneAndUpdate(
//       { "slot._id": id },
//       {
//         "slot.$.number": number,
//         "slot.$.status": status,
//         "slot.$.buyer": buyer,
//         "slot.$.personal_number": personal_number,
//         "slot.$.date_of_verification": date_of_verification,
//         "slot.$.days_since_verification": days_since_verification,
//         "slot.$.status_simCard": status_simCard,
//         "slot.$.physical_simCard": physical_simCard,
//         "slot.$.registration": registration,
//         "slot.$.WAcod": WAcod,
//         "slot.$.TGcod": TGcod,
//       },
//       { new: true }
//     )
//     res.json(updateSimCard);
//   } catch (error) {
//     res.status(500).json({
//       error: "Что то пошло не так",
//     });
//   }
// })

// app.patch('/update/simcardmanagers', async (req, res) => {
//   const { itemId, field, value, days_since_verification } = req.body;

//   try {
//     await SimModelManager.findOneAndUpdate(
//       { "slot._id": itemId },
//       { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
//     );

//     res.sendStatus(200);
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// });

// app.patch('/test/curatormanagers/:id', async (req, res) => {
//   const { id } = req.params;
//   const { curator } = req.body;
//   try {
//     const updateSimCard = await SimModelManager.findOneAndUpdate(
//       { _id: id },
//       { curator },
//       { new: true }
//     );
//     res.json(updateSimCard);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// })

// app.delete('/test/managerdelete/:id', async () => {
//   const { id } = req.params;
//   try {
//     const result = await SimModelManager.findByIdAndDelete(id);

//     if (result) {
//       res.status(200).json({ message: `Документ с id ${id} успешно удалён.` });
//     } else {
//       res.status(404).json({ message: `Документ с id ${id} не найден.` });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Ошибка при удалении документа.' });
//   }
// })



// const PORT = 4000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });