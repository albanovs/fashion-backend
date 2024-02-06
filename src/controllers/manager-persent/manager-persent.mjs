import ManagerPersent from "../../models/manager-persent/manager-persent.mjs";
import SimModelLider from "../../models/simcard/simlider.mjs";
import SimModelMonaco from '../../models/simcard/simmonaco.mjs'
import SimModelFenix from '../../models/simcard/simfenix.mjs'
import SimModelTuran from '../../models/simcard/simturan.mjs'
import SimModelNewOtdel from '../../models/simcard/simnewotdel.mjs'
import SimModelLiberty from "../../models/simcard/simliberty.mjs";
import cron from 'node-cron';
import calc_raiting_manager from "../calculate/calc_raiting_manager.mjs";
import newotdelCalc_raiting_manager from "../calculate/newotdel.calc_raiting_manager.mjs";
import monacoCalc_raiting_manager from "../calculate/monaco.calc_raiting_manager.mjs";
import turanCalc_raiting_manager from "../calculate/turan.calc_raiting_manager.mjs";
import newotdellibertyCalc_raiting_manager from "../calculate/newotdelliberty.calc_raiting_manager.mjs";
import fenixCalc_raiting_manager from "../calculate/fenix.calc_raiting_manager.mjs";

const getCurator = async () => {
    try {
        const [managersleader, managersmonaco, managersfenix, managersturan, managerfbox, managerliberty] = await Promise.all([
            SimModelLider.find(),
            SimModelMonaco.find(),
            SimModelFenix.find(),
            SimModelTuran.find(),
            SimModelNewOtdel.find(),
            SimModelLiberty.find()
        ]);

        const managers = [...managersleader, ...managersmonaco, ...managersfenix, ...managersturan, ...managerfbox, ...managerliberty];

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        for (const manager of managers) {
            if (manager.curator) {
                const existingData = await ManagerPersent.findOne({
                    datas: { $gte: new Date(currentYear, currentMonth, 1) },
                    manager: manager.curator,
                });
                if (!existingData) {
                    const newManagerPersent = new ManagerPersent({
                        datas: currentDate,
                        manager: manager.curator,
                        persent: []
                    });

                    await newManagerPersent.save();
                }
                const existingCurator = await ManagerPersent.findOne({
                    manager: manager.curator,
                });

                if (!existingCurator) {
                    const newManagerPersent = new ManagerPersent({
                        datas: currentDate,
                        manager: manager.curator,
                        persent: []
                    });

                    await newManagerPersent.save();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

cron.schedule('0 0 * * *', () => {
    getCurator();
});


const getManagers = async (req, res) => {
    try {
        const data = await ManagerPersent.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const AddPercent = async (req, res) => {
    const { manager, detail } = req.body;
    try {
        const currentDate = new Date();
        const allManagers = await ManagerPersent.find();
        const foundManager = allManagers.find(item => item.manager === manager)
            // && new Date(item.datas).getFullYear() === currentDate.getFullYear()
            // && new Date(item.datas).getMonth() === currentDate.getMonth());

        if (foundManager) {
            foundManager.persent.push(detail);
            await foundManager.save();
            res.status(200).json({
                success: true,
                message: 'Процент добавлен успешно.',
            });

        } else {
            res.status(404).json({
                error: 'Менеджер не найден или дата не совпадает',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Что-то пошло не так',
        });
    }
};

export default { getCurator, getManagers, AddPercent };
