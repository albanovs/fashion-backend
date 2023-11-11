import express from 'express';
const router = express.Router();
import clientsTuran from '../../controllers/clients-privlechennyi/clientsTuran.mjs'

router.post('/new-turanclient/:id', clientsTuran.newClient)
router.get('/turanclient', clientsTuran.getClient)
router.patch('/turanclient-update/:id', clientsTuran.updateClient)

export default router;