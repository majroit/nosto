// backend/src/controllers/currencyController.ts
import { Request, Response } from 'express';
import { convert } from '../services/currencyService';
import { logInflux } from '../services/influxService';

export const convertCurrency = async (req: Request, res: Response) => {
  const { sourceCurrency, targetCurrency, amount } = req.body;

  // Validate input
  if (!sourceCurrency || !targetCurrency || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const convertedAmount = await convert(sourceCurrency, targetCurrency, amount);
    // Log the conversion to InfluxDB
    try {
      await logInflux(sourceCurrency, targetCurrency, amount, convertedAmount.convertedNumber);
    } catch (logError) {
      console.error(`Failed to log conversion: ${logError}`);
    }
    return res.status(200).json({ convertedAmount });
  } catch (error) {
    console.error('Error in conversion function:', error);
    // Handle the unknown error type
    if (error instanceof Error) {
      return res.status(400).json({'error': true, 'message': `${error.message}`});
    } else {
      return res.status(400).json({'error': true, 'message': error});
    }
    }
};
