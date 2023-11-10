import LeaderClientsModel from "../../models/clients-privlechennyi/clients.mjs";

// const newClient = async (req, res) => {
//     try {
//         const {
//             client,
//             buyer_logist,
//             date_to,
//             date_go,
//             summa,
//             order_count
//         } = req.body
//         const newClient = new LeaderClientsModel({
//             client,
//             buyer_logist,
//             date_to,
//             date_go,
//             summa,
//             order_count
//         })
//         await newClient.save()
//     } catch (error) {
//         res.status(500).json({ massage: `${JSON.stringify(error)}` })
//     }
// }

const newClient = async (req, res) => {
    const clientData = req.body;

    try {
        // Создание новой записи в вашей MongoDB-модели для клиентов
        const result = await LeaderClientsModel.create(clientData);

        res.json(result);
    } catch (error) {
        console.error('Ошибка при создании данных клиента:', error);
        res.status(500).json({ error: 'Ошибка при создании данных клиента' });
    }
}



const getClient = async (req, res) => {
    try {
        const data = await LeaderClientsModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Что-то пошло не так" });
    }
};


export default { newClient, getClient }