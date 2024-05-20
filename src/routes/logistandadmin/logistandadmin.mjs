import express from 'express';
const router = express.Router();
import LogistAndAdmin from '../../controllers/logistandadmin/logist-and-admin.mjs'

router.post('/adminlogist/simcards', LogistAndAdmin.CreateTableSim)
router.post('/adminlogist/slots', LogistAndAdmin.updateSimLog)
router.patch('/adminlogist/:id', LogistAndAdmin.editSimTable)
router.get('/adminlogist', LogistAndAdmin.getLogistSim)
router.patch('/update/adminlogistdate', LogistAndAdmin.updateDateLogist)
router.delete('/test/adminlogist/:id', LogistAndAdmin.deleteSlot)

export default router;