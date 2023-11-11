import express from 'express';
const router = express.Router();
import clientsFenix from '../../controllers/clients-privlechennyi/clientsFenix.mjs'

router.post('/new-fenixclient/:id', clientsFenix.newClient)
router.get('/fenixclient', clientsFenix.getClient)
router.patch('/fenixclient-update/:id', clientsFenix.updateClient)

export default router;