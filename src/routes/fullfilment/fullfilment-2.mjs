import express from 'express'
const router = express.Router();
import fullfilmentController from '../../controllers/fullfilments/fullfilment-2.mjs'

router.post('/fullfilment2-create', fullfilmentController.createFullfilmentTable)
router.get('/fullfilment2-datas', fullfilmentController.getFullfilmentTable)
router.patch('/updatefullfilment2/:id', fullfilmentController.editFullfilmentTable)
router.post('/fullfilment2-addslot/:id', fullfilmentController.addFullfilmentSlot)
router.delete('fullfilment2-slotdelete/:id', fullfilmentController.deleteSlot)

export default router;