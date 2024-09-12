import express from 'express';
import profit from '../../controllers/incoming-and-outgoing/outgoing.mjs';

const router = express.Router();

router.get('/profit-datas', profit.getExpensesData);
router.get('/profit-all-datas', profit.getExpencesAllData);
router.patch('/profit/:id/:type/:selectedId', profit.updateExpensePatch);
router.patch('/profit/change-name', profit.updateNames);
router.post('/profit/add-category', profit.addCategory);
router.delete('/profit/delete-category', profit.deleteCategory);

export default router;