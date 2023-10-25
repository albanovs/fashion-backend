import express from 'express';
const router = express.Router();
import calcItog from '../../controllers/calculate-itogs/calcItog.mjs';

router.get('/calcitog', calcItog.calcItogs)

export default router