import { Router } from 'express';
import { TechController } from '../controllers/tech.controller';

const TechRouter: Router = Router();

TechRouter.get('/', TechController.getAvailableTech);

export default TechRouter;
