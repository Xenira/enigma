import { Router } from 'express';
import { check } from 'express-validator';
import { authorize } from 'passport';
import Authorization from '../config/passport';
import PlayerRouter from './player.route';

// Import used controllers
import * as userCtrl from '../controllers/user.controller';
import TechRouter from './tech.route';

const router: Router = Router();

router.get('/login', userCtrl.getCurrentUser);
router.post(
	'/login',
	check('email').isString().trim().isEmail().normalizeEmail(),
	authorize('local', { failWithError: true }),
	Authorization.login
);
router.post('/register', userCtrl.register);

router.use('/player', Authorization.any, PlayerRouter);
router.use('/tech', Authorization.any, TechRouter);

export default router;
