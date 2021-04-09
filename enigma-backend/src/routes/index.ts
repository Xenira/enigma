import { Router } from 'express';
import { authorize } from 'passport';
import Authorization from '../config/passport';

// Import used controllers
import * as userCtrl from '../controllers/user.controller';

const router: Router = Router();

router.get('/login', userCtrl.getCurrentUser);
router.post(
	'/login',
	authorize('local', { failWithError: true }),
	Authorization.login
);
router.post('/register', userCtrl.register);

export default router;
