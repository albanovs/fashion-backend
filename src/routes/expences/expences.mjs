import express from 'express'
const router = express.Router();
import expences from '../../controllers/expences/expences.mjs';

router.get('/expences-datas', expences.getExpensesData)
router.patch('/expenses/:id', expences.updateExpense);
router.patch('/expenses/:id/:type/:selectedId', expences.updateExpensePatch);
router.patch('/expenses/change-name', expences.updateNames)

export default router;