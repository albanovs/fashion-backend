import express from 'express';
const router = express.Router();
import getfactura from '../../controllers/telegram-bot/schet-control.mjs';

router.post('/schetfactura', getfactura.getSchetData)

export default router