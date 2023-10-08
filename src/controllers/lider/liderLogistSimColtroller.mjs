import SimModelLiderLog from "../../models/simcardlogist/liderlogist.mjs"

const CreateTableSim = async (req, res) => {
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
}

const updateSimLog = async (req, res) => {
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
}

const getLogistSim = async (req, res) => {
    try {
        const data = await SimModelLiderLog.find();
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
        await SimModelLiderLog.findOneAndUpdate(
            { "slot._id": itemId },
            { $set: { [`slot.$.${field}`]: value, "slot.$.days_since_verification": days_since_verification } }
        );

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export default { CreateTableSim, updateSimLog, getLogistSim, updateDateLogist }