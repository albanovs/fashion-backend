import TuranClientsModel from "../../models/clients-privlechennyi/clientsturan.mjs";
import cron from 'node-cron'

const newClient = async (req, res) => {
    const clientData = req.body;

    try {
        const result = await TuranClientsModel.create(clientData);

        res.json(result);
    } catch (error) {
        console.error('Ошибка при создании данных клиента:', error);
        res.status(500).json({ error: 'Ошибка при создании данных клиента' });
    }
}



const getClient = async (req, res) => {
    try {
        const data = await TuranClientsModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Что-то пошло не так" });
    }
};

const updateClient = async (req, res) => {
    const clientId = req.params.id;

    try {
        const existingClient = await TuranClientsModel.findById(clientId);

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

const updatedatas = async (req, res) => {
    try {
        const today = new Date();
        const clients = await TuranClientsModel.find();
        for (const client of clients) {
            const dateGoParts = client.date_go.split('.');
            const dateGo = new Date(`${dateGoParts[2]}-${dateGoParts[1]}-${dateGoParts[0]}`);
            if (client.order_count >= 10 || client.summa >= 50000 || dateGo <= today) {
                client.status = false;
                await client.save();
            }
        }
    } catch (error) {
        console.error('Ошибка при обновлении клиентов:', error);
    }
};

updatedatas()

cron.schedule('0 0 * * *', () => {
    updatedatas();
}, {
    scheduled: true,
    timezone: 'Europe/Moscow'
});

export default { newClient, getClient, updateClient }