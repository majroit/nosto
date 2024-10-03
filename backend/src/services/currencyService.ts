// backend/src/services/currencyService.ts

import axios from 'axios';
import { RedisClientType, createClient } from 'redis';

// Base URL for the Swop API
const BASE_URL = 'https://swop.cx/rest/rates';
const CACHE_EXPIRY_SECONDS = 3600; // 1 hour

// Create a Redis client
const redisClient: RedisClientType = createClient({
  url: 'redis://localhost:6379',
});

// Connect to Redis on startup
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Could not connect to Redis:', error);
  }
})();

// Cache exchange rates in Redis
const cacheRates = async (rates: Array<{ base_currency: string, quote_currency: string, quote: number }>) => {
  try {
    await redisClient.setEx('currency_rates', CACHE_EXPIRY_SECONDS, JSON.stringify(rates));
    console.log('Rates cached successfully');
  } catch (error) {
    console.error('Error caching rates:', error);
  }
};

// Retrieve cached rates from Redis
const getCachedRates = async () => {
  try {
    const cachedRates = await redisClient.get('currency_rates');
    return cachedRates ? JSON.parse(cachedRates) : null;
  } catch (error) {
    console.error('Error fetching cached rates:', error);
    return null;
  }
};

// Get exchange rates, either from the cache or by fetching from the API
const getRates = async (): Promise<Array<{ base_currency: string, quote_currency: string, quote: number }>> => {
  const cachedRates = await getCachedRates();
  if (cachedRates) {
    return cachedRates;
  }

  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${process.env.SWOP_API_KEY}`,
      },
    });

    console.log('API Response:', response.data);

    if (!response.data) {
      throw new Error(`Invalid response structure: ${JSON.stringify(response.data)}`);
    }

    const rates: Array<{ base_currency: string, quote_currency: string, quote: number }> = response.data;
    await cacheRates(rates);
    return rates;
  } catch (error) {
    console.error('Error fetching rates from API:', error);
    throw new Error('Could not fetch rates from the Swop API.');
  }
};

/**
 * Convert an amount from one currency to another using EUR as an intermediary.
 * @param sourceCurrency The source currency (e.g., USD)
 * @param targetCurrency The target currency (e.g., GBP)
 * @param amount The amount to convert
 * @returns The converted amount and the rate used
 */
export const convert = async (sourceCurrency: string, targetCurrency: string, amount: number) => {
  let convertedAmount = { convertedNumber: 0, quote: 0 };

  try {
    const rates = await getRates(); // Fetch rates once

    console.log('Rates:', rates);

    // Find EUR to sourceCurrency rate
    const eurToSourceRateObj = rates.find(rate => rate.base_currency === 'EUR' && rate.quote_currency === sourceCurrency);
    if (!eurToSourceRateObj) {
      throw new Error(`Currency code "${sourceCurrency}" not found in rates.`);
    }
    const eurToSourceRate = eurToSourceRateObj.quote;

    // Find EUR to targetCurrency rate
    const eurToTargetRateObj = rates.find(rate => rate.base_currency === 'EUR' && rate.quote_currency === targetCurrency);
    if (!eurToTargetRateObj) {
      throw new Error(`Currency code "${targetCurrency}" not found in rates.`);
    }
    const eurToTargetRate = eurToTargetRateObj.quote;

    // Log the retrieved rates for debugging
    console.log(`EUR to ${sourceCurrency}: ${eurToSourceRate}`);
    console.log(`EUR to ${targetCurrency}: ${eurToTargetRate}`);

    // Calculate the source to target currency rate
    const sourceToTargetRate = (1 / eurToSourceRate) * eurToTargetRate;

    // Convert the amount from source to target currency
    convertedAmount = {
      convertedNumber: parseFloat((amount * sourceToTargetRate).toFixed(2)), // Convert to number
      quote: parseFloat(sourceToTargetRate.toFixed(2)), // Convert to number
    };

    return convertedAmount; // Return the converted amount
  } catch (error) {
    console.error('Error in conversion function:', error);

    // Handle the unknown error type
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    } else {
      throw new Error('An unknown error occurred during currency conversion.');
    }
  }
};
