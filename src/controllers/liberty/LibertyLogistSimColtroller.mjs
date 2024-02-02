import SimModelLibertyLog from "../../models/simcardlogist/libertylogist.mjs"

const CreateTableSim = async (req, res) => {
    try {
        const { curator } = req.body
        const newData = new SimModelLibertyLog({
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
}

const updateSimLog = async (req, res) => {
    try {
        const { id } = req.body;

        const newData = await SimModelLibertyLog.findByIdAndUpdate(
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
}

const getLogistSim = async (req, res) => {
    try {
        const data = await SimModelLibertyLog.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const updateDateLogist = async (req, res) => {
    const { itemId, field, value, days_since_verification } = req.body;

    try {
        await SimModelLibertyLog.findOneAndUpdate(
            { "slot._id": itemId },
            { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
        );

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const editSimTable = async (req, res) => {
    const { id } = req.params;
    const {
        number,
        status,
        logist,
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
        const updateSimCard = await SimModelLibertyLog.findOneAndUpdate(
            { "slot._id": id },
            {
                "slot.$.number": number,
                "slot.$.status": status,
                "slot.$.logist": logist,
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

const upDateCurator = async (req, res) => {
    const { id } = req.params;
    const { curator } = req.body;
    try {
        const updateSimCard = await SimModelLibertyLog.findOneAndUpdate(
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
        const updatedSimCard = await SimModelLibertyLog.findOneAndUpdate(
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

const deleteCurator = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDocument = await SimModelLibertyLog.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ error: "Документ не найден" });
        }
        res.json({ message: "Документ успешно удален" });
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так при удалении документа",
        });
    }
};

export default { CreateTableSim, updateSimLog, getLogistSim, updateDateLogist, editSimTable, upDateCurator, deleteSlot, deleteCurator }