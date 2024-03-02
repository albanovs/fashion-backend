import express from 'express';
const router = express.Router();
import getfactura from '../../controllers/telegram-bot/schet-control.mjs';

router.get('/schetfactura', getfactura.getSchetData)

export default router