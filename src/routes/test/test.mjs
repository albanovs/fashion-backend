import express from 'express';
const router = express.Router();
import test from '../../controllers/test/test.mjs';

router.get('/test', test.getDataTest)
router.delete('/test/:id', test.deleteDatas)
router.patch('/test/:id', test.changeData)
router.post('/test', test.postData)

export default router