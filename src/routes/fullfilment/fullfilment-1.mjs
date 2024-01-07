import express from 'express'
const router = express.Router();
import fullfilmentController from '../../controllers/fullfilments/fullfilment-1.mjs'

router.post('/fullfilment1-create', fullfilmentController.createFullfilmentTable)
router.get('/fullfilment1-datas', fullfilmentController.getFullfilmentTable)
router.patch('/updatefullfilment1/:id', fullfilmentController.editFullfilmentTable)
router.post('/fullfilment1-addslot/:id', fullfilmentController.addFullfilmentSlot)
router.delete('fullfilment1-slotdelete/:id', fullfilmentController.deleteSlot)
router.delete('fullfilment1-delete', fullfilmentController.deleteOtchet)

export default router;