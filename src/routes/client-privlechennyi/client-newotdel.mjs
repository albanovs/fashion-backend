import express from 'express';
const router = express.Router();
import clientsNewOtdel from '../../controllers/clients-privlechennyi/clientsNewOtdel.mjs';

router.post('/new-otdelclient/:id', clientsNewOtdel.newClient)
router.get('/newotdelclient', clientsNewOtdel.getClient)
router.patch('/newotdelclient-update/:id', clientsNewOtdel.updateClient)

export default router;