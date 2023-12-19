import express from 'express';
const router = express.Router();
import RolesController from '../../controllers/roles/roles.mjs'

router.post('/createPractic', RolesController.createRoles)
router.patch('/practic/:id', RolesController.editRoles)
router.get('/practic', RolesController.getRoles)
router.delete('/practic-delete/:id', RolesController.deleteRoles)

export default router