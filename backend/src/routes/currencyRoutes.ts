import { Router } from 'express';
import { convertCurrency } from '../controllers/currencyController';

const router = Router();

router.post('/convert', convertCurrency);

export { router as currencyRoutes };

