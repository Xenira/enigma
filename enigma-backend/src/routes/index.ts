import { Request, Response, Router } from 'express';
import { check } from 'express-validator';
import { authorize } from 'passport';
import Authorization from '../config/passport';
import PlayerRouter from './player.route';

// Import used controllers
import * as userCtrl from '../controllers/user.controller';
import TechRouter from './tech.route';
import { GameController } from '../controllers/game.controller';

const router: Router = Router();

router.get('/login', userCtrl.getCurrentUser);
router.post(
	'/login',
	check('email').isString().trim().isEmail().normalizeEmail(),
	authorize('local', { failWithError: true }),
	Authorization.login
);
router.post('/logout', (req: Request, res: Response) => {
	req.logout();
	res.sendStatus(204);
});
router.post('/register', userCtrl.register);

router.use(
	'/player',
	Authorization.any,
	GameController.loadPlayerData,
	GameController.simulate,
	PlayerRouter
);
router.use(
	'/tech',
	Authorization.any,
	GameController.loadPlayerData,
	GameController.simulate,
	TechRouter
);

export default router;
