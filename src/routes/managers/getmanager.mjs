import express from 'express';
const router = express.Router();
import managerPersent from '../../controllers/manager-persent/manager-persent.mjs';

router.get('/get-manager-persent', managerPersent.getManagers)
router.post('/get-manager-persents', managerPersent.getCurator)

export default router