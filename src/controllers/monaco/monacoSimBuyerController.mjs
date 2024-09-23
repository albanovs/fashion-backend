import SimModelMonaco from "../../models/simcard/simmonaco.mjs"
import cron from 'node-cron'


const createSimTable = async (req, res) => {
    try {
        const { curator } = req.body
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        const newData = new SimModelMonaco({
            data_register: formattedDate,
            curator: curator,
            slot: []
        })
        await newData.save()
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
}

const getSimTable = async (req, res) => {
    try {
        const data = await SimModelMonaco.find();
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
        await SimModelMonaco.findOneAndUpdate(
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
        const updateSimCard = await SimModelMonaco.findOneAndUpdate(
            { _id: id },
            { curator },
            { new: true }
        );
        res.json(updateSimCard);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteSlot = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSimCard = await SimModelMonaco.findOneAndUpdate(
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
        const datas = await SimModelMonaco.find();
        for (const elem of datas) {
            for (const slot of elem.slot) {
                if (slot.date_of_verification) {
                    const selectedDate = new Date(slot.date_of_verification);
                    const timeDiff = today.getTime() - selectedDate.getTime();
                    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                    await SimModelMonaco.findOneAndUpdate(
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

cron.schedule('0 0 * * *', () => {
    updateDaysSinceVerification();
}, {
    scheduled: true,
    timezone: 'Europe/Moscow'
});

const deleteManager = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await SimModelMonaco.findByIdAndDelete(id);

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

export default { createSimTable, addSimSlot, editSimTable, getSimTable, updateSimcard, upDateCurator, deleteSlot, deleteManager }