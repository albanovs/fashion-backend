import express from 'express'
const router = express.Router();
import fullfilmentController from '../../controllers/fullfilments/fullfilment-3.mjs'

router.post('/fullfilment3-create', fullfilmentController.createFullfilmentTable)
router.get('/fullfilment3-datas', fullfilmentController.getFullfilmentTable)
router.patch('/updatefullfilment3/:id', fullfilmentController.editFullfilmentTable)
router.post('/fullfilment3-addslot/:id', fullfilmentController.addFullfilmentSlot)
router.delete('fullfilment3-slotdelete/:id', fullfilmentController.deleteSlot)

export default router;