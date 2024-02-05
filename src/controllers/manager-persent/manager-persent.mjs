import cron from 'node-cron';
import ManagerPersent from "../../models/manager-persent/manager-persent.mjs";

// Импорт всех моделей SimCard
const simModels = [
    'SimModelLider',
    'SimModelMonaco',
    'SimModelFenix',
    'SimModelTuran',
    'SimModelNewOtdel',
    'SimModelLiberty'
];

// Импорт всех функций расчета рейтинга
const calcFunctions = [
    'calc_raiting_manager',
    'newotdelCalc_raiting_manager',
    'monacoCalc_raiting_manager',
    'turanCalc_raiting_manager',
    'newotdellibertyCalc_raiting_manager',
    'fenixCalc_raiting_manager'
];

// Динамический импорт моделей SimCard
const simModelsImports = simModels.map(model => import(`../../models/simcard/${model.toLowerCase()}.mjs`));

// Динамический импорт функций расчета рейтинга
const calcFunctionsImports = calcFunctions.map(func => import(`../calculate/${func.toLowerCase()}.mjs`));

const getCurator = async () => {
    try {
        const simModelsData = await Promise.all(simModelsImports.map(importedModel => importedModel.then(model => model.find())));
        const managers = simModelsData.flat();

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
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
}

const AddPercent = async (req, res) => {
    const { manager, detail } = req.body;
    try {
        const currentDate = new Date();
        const allManagers = await ManagerPersent.find();
        const foundManager = allManagers.find(item => item.manager === manager
            && item.datas.getFullYear() === currentDate.getFullYear()
            && item.datas.getMonth() === currentDate.getMonth());

        if (foundManager) {
            foundManager.persent.push(detail);
            await foundManager.save();
            await Promise.all(calcFunctionsImports.map(importedFunc => importedFunc.then(func => func.updateCalcManager())));

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
