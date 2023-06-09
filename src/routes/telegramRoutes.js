import express from 'express';
import {
  addTelegramSlot,
  updateTelegramSlot,
  createTelegramSlots,
  getTelegramSlots,
} from '../controllers/telegramController.js';

const router = express.Router();

router.post('/telegramslot', addTelegramSlot);
router.patch('/slot/:id', updateTelegramSlot);
router.post('/create-slots', createTelegramSlots);
router.get('/', getTelegramSlots);

export default router;