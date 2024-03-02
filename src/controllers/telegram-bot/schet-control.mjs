import schetfakturaModel from "../../models/schet-factura/schet-faktura.mjs";


const getSchetData = async (req, res) => {
    try {
        const data = await schetfakturaModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

export default { getSchetData }