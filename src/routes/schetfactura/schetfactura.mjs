import express from 'express';
const router = express.Router();
import getfactura from '../../controllers/telegram-bot/schet-control.mjs';

router.get('/schetfactura', getfactura.getSchetData)
router.get('/schetfactura-fbox', getfactura.getSchetDatafbox)
router.get('/schetfactura-monaco', getfactura.getSchetDatamonaco)
router.get('/schetfactura-turan', getfactura.getSchetDataturan)
router.get('/schetfactura-fenix', getfactura.getSchetDatafenix)
router.get('/schetfactura-liberty', getfactura.getSchetDataliberty)
router.get('/schetfactura-leader', getfactura.getSchetDataleader)

export default router