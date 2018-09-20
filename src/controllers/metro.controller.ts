import { Router } from 'express';
import { dialogflow } from 'actions-on-google';
import { MetroService } from '../services/metro.service';

const app = dialogflow();
const router = Router();
const metro = new MetroService();

router.use(app);

export const MetroController = router;