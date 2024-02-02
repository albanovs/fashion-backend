import ManagerPersent from "../../models/manager-persent/manager-persent.mjs";
import SimModelLider from "../../models/simcard/simlider.mjs";
import SimModelMonaco from '../../models/simcard/simmonaco.mjs'
import SimModelFenix from '../../models/simcard/simfenix.mjs'
import SimModelTuran from '../../models/simcard/simturan.mjs'
import cron from 'node-cron';

const getCurator = async () => {
    try {
        const [managersleader, managersmonaco, managersfenix, managersturan] = await Promise.all([
            SimModelLider.find(),
            SimModelMonaco.find(),
            SimModelFenix.find(),
            SimModelTuran.find(),
        ]);

        const managers = [...managersleader, ...managersmonaco, ...managersfenix, ...managersturan];
        console.log(managers);
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

export default { getCurator, getManagers };
