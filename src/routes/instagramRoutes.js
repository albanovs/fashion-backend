import express from 'express';
import {
  addInstagramSlot,
  updateInstagramSlot,
  createInstagramSlots,
  getInstagramSlots,
} from '../controllers/instagramController.js';

const router = express.Router();

router.post('/test/mymodels', addInstagramSlot);
router.patch('/test/mymodels/:id', updateInstagramSlot);
router.post('/insert/account', createInstagramSlots);
router.get('/', getInstagramSlots);

export default router;