import express from 'express';
const router = express.Router();
import RolesController from '../../controllers/roles/roles.mjs'

router.post('/createRoles', RolesController.createRoles)
router.patch('/roles:id', RolesController.editRoles)
router.get('/roles', RolesController.getRoles)

export default router