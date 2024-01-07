import express from 'express'
const router = express.Router();
import fullfilmentController3 from '../../controllers/fullfilments/fullfilment-3.mjs'

router.post('/fullfilment3-create', fullfilmentController3.createFullfilmentTable)
router.get('/fullfilment3-datas', fullfilmentController3.getFullfilmentTable)
router.patch('/updatefullfilment3/:id', fullfilmentController3.editFullfilmentTable)
router.post('/fullfilment3-addslot/:id', fullfilmentController3.addFullfilmentSlot)
router.delete('fullfilment3-slotdelete/:id', fullfilmentController3.deleteSlot)

export default router;