import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';

const PlayerRouter: Router = Router();

PlayerRouter.get('/', PlayerController.getPlayerData);

export default PlayerRouter;
