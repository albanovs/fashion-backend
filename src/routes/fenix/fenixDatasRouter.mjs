import express from 'express';
const router = express.Router();
import fenixDatasController from '../../controllers/fenix/fenixDatasController.mjs'

router.post('/test/fenixdatas', fenixDatasController.createFenixData)
router.get('/test/fenixdatas', fenixDatasController.getFenixData)
router.patch('/updateDatafenix/:id', fenixDatasController.updateFenixData)

export default router