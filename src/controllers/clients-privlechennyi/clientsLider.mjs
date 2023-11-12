import LeaderClientsModel from "../../models/clients-privlechennyi/clients.mjs";
import cron from 'node-cron'

const newClient = async (req, res) => {
    const clientData = req.body;

    try {
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

const updateClient = async (req, res) => {
    const clientId = req.params.id;

    try {
        const existingClient = await LeaderClientsModel.findById(clientId);

        if (!existingClient) {
            return res.status(404).json({ error: 'Клиент не найден' });
        }
        existingClient.summa = parseFloat(existingClient.summa) + parseFloat(req.body.summa);
        existingClient.order_count = parseFloat(existingClient.order_count) + parseFloat(req.body.order_count);

        const updatedClient = await existingClient.save();

        res.status(200).json(updatedClient);
    } catch (error) {
        console.error('Ошибка при обновлении клиента:', error);
        res.status(500).json({ error: 'Что-то пошло не так' });
    }
};


export default { newClient, getClient, updateClient }