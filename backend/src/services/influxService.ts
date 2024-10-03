// backend/src/database/influx.ts
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import dotenv from 'dotenv';

dotenv.config();

const influxDB = new InfluxDB({ 
  url: process.env.INFLUXDB_URL || 'http://localhost:8086', 
  token: process.env.INFLUXDB_TOKEN  
});

const writeApi = influxDB.getWriteApi(
  process.env.INFLUXDB_ORG || 'majid', 
  process.env.INFLUXDB_BUCKET || 'nosto', 
  'ns'
);

export const logInflux = async (
  sourceCurrency: string, 
  targetCurrency: string, 
  amount: number, 
  convertedAmount: number
) => {
  const point = new Point('currency_conversion')
    .tag('source', sourceCurrency)
    .tag('target', targetCurrency)
    .floatField('amount', amount)
    .floatField('converted_amount', convertedAmount);

  try {
    writeApi.writePoint(point);
    await writeApi.flush();
    console.log('Conversion logged to InfluxDB');
  } catch (error) {
    console.error(`Error logging to InfluxDB: ${error}`);
  }
};
