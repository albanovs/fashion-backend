import SimModelFenix from "../../models/simcard/simfenix.mjs"

const createSimTable = async (req, res) => {
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
}

const addSimSlot = async (req, res) => {
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

export default { createSimTable, addSimSlot, editSimTable, getSimTable, updateSimcard, upDateCurator, deleteSlot }