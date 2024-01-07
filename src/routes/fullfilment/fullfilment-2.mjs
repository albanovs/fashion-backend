import express from 'express'
const router = express.Router();
import fullfilmentController2 from '../../controllers/fullfilments/fullfilment-2.mjs'

router.post('/fullfilment2-create', fullfilmentController2.createFullfilmentTable)
router.get('/fullfilment2-datas', fullfilmentController2.getFullfilmentTable)
router.patch('/updatefullfilment2/:id', fullfilmentController2.editFullfilmentTable)
router.post('/fullfilment2-addslot/:id', fullfilmentController2.addFullfilmentSlot)
router.delete('fullfilment2-slotdelete/:id', fullfilmentController2.deleteSlot)
router.delete('fullfilment2-delete', fullfilmentController2.deleteOtchet)

export default router;