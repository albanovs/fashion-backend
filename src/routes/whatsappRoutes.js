import express from 'express';
import {
  addWhatsappSlot,
  updateWhatsappSlot,
  createWhatsappSlot,
  getWhatsappSlots,
} from '../controllers/whatsappController.js';

const router = express.Router();

router.post('/test/whatsappslot', addWhatsappSlot);
router.patch('/test/whatsappslot/:id', updateWhatsappSlot);
router.post('/test/whatsappslot', createWhatsappSlot);
router.get('/', getWhatsappSlots);

export default router;