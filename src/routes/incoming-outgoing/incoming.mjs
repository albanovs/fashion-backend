import express from 'express';
import expences from '../../controllers/incoming-and-outgoing/incoming.mjs';

const router = express.Router();

router.get('/expences-datas', expences.getExpensesData);
router.get('/expences-all-datas', expences.getExpencesAllData);
router.patch('/expenses/:id/:type/:selectedId', expences.updateExpensePatch);
router.patch('/expenses/change-name', expences.updateNames);
router.post('/expenses/add-category', expences.addCategory);
router.delete('/expenses/delete-category', expences.deleteCategory);

export default router;