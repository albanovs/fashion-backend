import express from 'express'
const router = express.Router();
import fullfilmentController from '../../controllers/fullfilments/fullfilment-4.mjs'

router.post('/fullfilment4-create', fullfilmentController.createFullfilmentTable)
router.get('/fullfilment4-datas', fullfilmentController.getFullfilmentTable)
router.patch('/updatefullfilment4/:id', fullfilmentController.editFullfilmentTable)
router.post('/fullfilment4-addslot/:id', fullfilmentController.addFullfilmentSlot)
router.delete('fullfilment4-slotdelete/:id', fullfilmentController.deleteSlot)

export default router;