import express from 'express';
const router = express.Router();
import clientsMonaco from '../../controllers/clients-privlechennyi/clientsMonaco.mjs'

router.post('/new-monacoclient/:id', clientsMonaco.newClient)
router.get('/monacoclient', clientsMonaco.getClient)
router.patch('/monacoclient-update/:id', clientsMonaco.updateClient)

export default router;