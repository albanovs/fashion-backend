import express from 'express';
const router = express.Router();
import managerPersent from '../../controllers/manager-persent/manager-persent.mjs';

router.get('/get-manager-persent', managerPersent.getManagers)
router.post('/get-manager-persents', managerPersent.getCurator)
router.patch('/add-manager-persents', managerPersent.AddPercent)

export default router