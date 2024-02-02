import express from 'express';
const router = express.Router();
import clientsLiberty from '../../controllers/clients-privlechennyi/clientsLiberty.mjs';

router.post('/new-libertyclient/:id', clientsLiberty.newClient)
router.get('/libertyclient', clientsLiberty.getClient)
router.patch('/libertyclient-update/:id', clientsLiberty.updateClient)

export default router;