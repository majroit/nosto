import request from 'supertest';
import express from 'express';
import { currencyRoutes } from '../src/routes/currencyRoutes';

const app = express();
app.use(express.json());
app.use('/api', currencyRoutes);

describe('Currency Conversion API', () => {
  it('should convert USD to GBP', async () => {
    const response = await request(app)
      .post('/api/convert')
      .send({ sourceCurrency: 'USD', targetCurrency: 'GBP', amount: 30 });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('convertedAmount');
  });

  it('should return error for invalid input', async () => {
    const response = await request(app)
      .post('/api/convert')
      .send({ sourceCurrency: 'INVALID', targetCurrency: 'GBP', amount: 'thirty' });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid currency');
  });
});
