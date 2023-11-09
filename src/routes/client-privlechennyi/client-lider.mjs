import express from 'express';
const router = express.Router();
import clientsLider from '../../controllers/clients-privlechennyi/clientsLider.mjs';

router.post('/new-leaderclient', clientsLider.newClient)
router.get('/leaderclient', clientsLider.getClient)

export default router;