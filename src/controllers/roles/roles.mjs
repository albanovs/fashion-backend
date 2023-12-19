import ModelRoles from "../../models/roles/roles.mjs";

const createRoles = async (req, res) => {
    try {
        const { title, description, date } = req.body
        const newRoles = new ModelRoles({
            title: title,
            description: description,
            date: date
        })
        await newRoles.save()
        res.status(200).json({ massage: `${JSON.stringify(newRoles)}` })
    } catch (error) {
        res.status(500).json({ massage: `${JSON.stringify(error)}` })
    }
}

const editRoles = async (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body;
    try {
        const updateRoles = await ModelRoles.findByIdAndUpdate(
            id,
            { title, description, date },
            { new: true }
        )
        res.json(updateRoles);
    } catch (error) {
        res.status(500).json({ massage: `${JSON.stringify(error)}` })
    }
}

const getRoles = async (req, res) => {
    try {
        const data = await ModelRoles.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: "Что-то пошло не так" });
    }
}

const deleteRoles = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRoles = await ModelRoles.findByIdAndDelete(id);
        if (!deletedRoles) {
            return res.status(404).json({ error: 'Roles not found' });
        }
        res.json({ message: 'Roles deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: "Что-то пошло не так" });
    }
}

export default { createRoles, editRoles, getRoles, deleteRoles }