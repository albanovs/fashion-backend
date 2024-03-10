import express from 'express'
const router = express.Router();
import fullfilmentController from '../../controllers/fullfilments/fullfilment-1.mjs'

router.post('/fullfilment1-create', fullfilmentController.createFullfilmentTable)
router.get('/fullfilment1-datas', fullfilmentController.getFullfilmentTable)
router.get('/fullfilment1-datas-success', fullfilmentController.getSuccesData)
router.patch('/updatefullfilment1/:id', fullfilmentController.editFullfilmentTable)
router.patch('/updatefullfilment1itog/:id', fullfilmentController.updateResult)
router.post('/fullfilment1-addslot/:id', fullfilmentController.addFullfilmentSlot)
router.delete('/fullfilment1-delete/:id', fullfilmentController.deleteOtchet)
router.post('/fufullfilment1-insert', fullfilmentController.checkAndMoveDocuments)

export default router;