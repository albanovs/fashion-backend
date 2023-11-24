import SimModelLider from "../../models/simcard/simlider.mjs"

const createSimTable = async (req, res) => {
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
}

const addSimSlot = async (req, res) => {
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
}

const getSimTable = async (req, res) => {
    try {
        const data = await SimModelLider.find();
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
        await SimModelLider.findOneAndUpdate(
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
    const { id } = req.params
    const { curator } = req.body

    try {
        const updateSimCard = await SimModelLider.findOneAndUpdate(
            { id },
            { curator },
            { new: true }
        )
        res.json(updateSimCard);
    } catch (error) {
        console.log(error);
    }
}

export default { createSimTable, addSimSlot, editSimTable, getSimTable, updateSimcard, upDateCurator }