import ModelManagerRaiting from "../../models/rainting/managerrainting/manager.mjs";
import SimModelFenix from "../../models/simcard/simfenix.mjs"
import cron from 'node-cron'

const createSimTable = async (req, res) => {
    try {
        const { curator } = req.body
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        const newData = new SimModelFenix({
            data_register: formattedDate,
            curator: curator,
            slot: []
        })
        await newData.save()
        const currentDateRaiting = new Date().toISOString().slice(0, 7);
        let currentManagerRaiting = await ModelManagerRaiting.findOne({ datas: currentDateRaiting });
        if (currentManagerRaiting) {
            const curatorExists = currentManagerRaiting.managers.some(manager => manager.curator === curator);

            if (!curatorExists) {
                currentManagerRaiting.managers.push({
                    otdel: 'Ильяс',
                    id_manager: newData._id,
                    curator: curator,
                    data_register: formattedDate,
                    buyerLength: 0,
                    totalcom: 0,
                    order: 0,
                    comission: 0,
                    comissionVM: 0,
                    allCoeff: '0',
                    detail: [],
                    remainder: 0,
                    for_withdrawal: [],
                });
                await currentManagerRaiting.save();
                console.log(`Куратор ${curator} добавлен в список managers.`);
            } else {
                console.log(`Куратор ${curator} уже существует в списке managers.`);
            }
        }
        res.status(200).json({ massage: `${JSON.stringify(newData)}` })
    } catch (error) {
        res.status(500).json({ massage: `${JSON.stringify(error)}` })
    }
}

const addSimSlot = async (req, res) => {
    try {
        const { id } = req.body;
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
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
                        data_register: formattedDate,
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
}

const editSimTable = async (req, res) => {
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
        const simData = await SimModelFenix.find();
        if (!simData.length) {
            console.log('Нет данных в SimModelFenix');
            return;
        }

        const currentDate = new Date().toISOString().slice(0, 7);
        const managerRaiting = await ModelManagerRaiting.findOne({ datas: currentDate });

        if (!managerRaiting) {
            console.log(`Документ с датой ${currentDate} не найден в ModelManagerRaiting`);
            return;
        }

        const buyersInSim = new Map();
        simData.forEach(sim => {
            if (sim.slot && Array.isArray(sim.slot)) {
                sim.slot.forEach(slotItem => {
                    if (slotItem.buyer && slotItem.status === '2') {
                        buyersInSim.set(
                            slotItem.buyer.replace(/\s/g, '').toLowerCase(),
                            { buyer: slotItem.buyer, curator: sim.curator || null, register: sim.data_register }
                        );
                    }
                });
            }
        });
        managerRaiting.managers
            .filter(manager => manager.otdel === "Ильяс")
            .forEach(manager => {
                buyersInSim.forEach(({ buyer, curator, register }, key) => {
                    const buyerExists = manager.detail.some(detail =>
                        detail.name.replace(/\s/g, '').toLowerCase() === key
                    );

                    if (!buyerExists && manager.curator === curator) {
                        manager.detail.push({
                            name: buyer,
                            status: '2',
                            orders: 0,
                            summa: 0,
                            team: 'Ильяс',
                            curator: manager.curator,
                            coeff: 0,
                            data_register: register,
                        });
                        manager.buyerLength = (manager.buyerLength || 0) + 1;
                    }
                });
                manager.detail.forEach(detail => {
                    const buyerName = detail.name.replace(/\s/g, '').toLowerCase();
                    const buyerDataInSim = buyersInSim.get(buyerName);

                    if (!buyerDataInSim || buyerDataInSim.curator !== manager.curator) {
                        detail.status = '1';
                    } else {
                        detail.status = '2';
                    }
                });
                manager.buyerLength = manager.detail.filter(d => d.status === '2').length;
            });
        await managerRaiting.save();
        res.json(updateSimCard);
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const getSimTable = async (req, res) => {
    try {
        const data = await SimModelFenix.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const updateSimcard = async (req, res) => {
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
}

const upDateCurator = async (req, res) => {
    const { id } = req.params;
    const { curator } = req.body;
    try {
        const updateSimCard = await SimModelFenix.findOneAndUpdate(
            { _id: id },
            { curator },
            { new: true }
        );
        const currentDate = new Date().toISOString().slice(0, 7);
        const managerrainting = await ModelManagerRaiting.findOne({ datas: currentDate });

        if (managerrainting) {
            managerrainting.managers.find((item) => item.id_manager === id).curator = curator;
            await managerrainting.save();
        }
        res.json(updateSimCard);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteSlot = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSimCard = await SimModelFenix.findOneAndUpdate(
            { "slot._id": id },
            { $pull: { slot: { _id: id } } },
            { new: true }
        );
        res.json(updatedSimCard);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так при удалении слота",
        });
    }
};

const updateDaysSinceVerification = async () => {
    try {
        const today = new Date();
        const datas = await SimModelFenix.find();
        for (const elem of datas) {
            for (const slot of elem.slot) {
                if (slot.date_of_verification) {
                    const selectedDate = new Date(slot.date_of_verification);
                    const timeDiff = today.getTime() - selectedDate.getTime();
                    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                    await SimModelFenix.findOneAndUpdate(
                        { "slot._id": slot._id },
                        { $set: { "slot.$.days_since_verification": daysDiff.toString() } }
                    );
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const deleteManager = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await SimModelFenix.findByIdAndDelete(id);
        const currentDate = new Date().toISOString().slice(0, 7);
        const managerrainting = await ModelManagerRaiting.findOne({ datas: currentDate });

        if (managerrainting) {
            managerrainting.managers = managerrainting.managers.filter((item) => item.id_manager !== id);
            await managerrainting.save();
        }
        if (result) {
            res.status(200).json({ message: `Документ с id ${id} успешно удалён.` });
        } else {
            res.status(404).json({ message: `Документ с id ${id} не найден.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при удалении документа.' });
    }
};

cron.schedule('0 0 * * *', () => {
    updateDaysSinceVerification();
}, {
    scheduled: true,
    timezone: 'Europe/Moscow'
});

export default { createSimTable, addSimSlot, editSimTable, getSimTable, updateSimcard, upDateCurator, deleteSlot, deleteManager }