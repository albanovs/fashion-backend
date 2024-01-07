import express from 'express'
const router = express.Router();
import fullfilmentController4 from '../../controllers/fullfilments/fullfilment-4.mjs'

router.post('/fullfilment4-create', fullfilmentController4.createFullfilmentTable)
router.get('/fullfilment4-datas', fullfilmentController4.getFullfilmentTable)
router.patch('/updatefullfilment4/:id', fullfilmentController4.editFullfilmentTable)
router.post('/fullfilment4-addslot/:id', fullfilmentController4.addFullfilmentSlot)
router.delete('/fullfilment4-slotdelete/:id', fullfilmentController4.deleteSlot)
router.delete('/fullfilment4-delete/:id', fullfilmentController4.deleteOtchet)

export default router;