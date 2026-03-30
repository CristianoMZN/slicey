import { config } from 'dotenv';

config();

export const ENV = {
  PORT: Number(process.env.API_PORT ?? process.env.PORT ?? 3000),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  OPENAPI_TITLE: process.env.OPENAPI_TITLE || 'Elysia API',
  OPENAPI_VERSION: process.env.OPENAPI_VERSION || '1.0.0',
  WEBSOCKET_URL: process.env.WEBSOCKET_URL || 'ws://localhost:3000/ws',
  STORAGE_URL: process.env.STORAGE_URL || '',
  STORAGE_NAME: process.env.STORAGE_NAME || '',
  STORAGE_REGION: process.env.STORAGE_REGION || 'us-east-1',
  STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY || '',
  STORAGE_SECRET_KEY: process.env.STORAGE_SECRET_KEY || '',
  PUSH_VAPID_PUBLIC_KEY: process.env.PUSH_VAPID_PUBLIC_KEY || '',
  PUSH_VAPID_PRIVATE_KEY: process.env.PUSH_VAPID_PRIVATE_KEY || '',
  PUSH_VAPID_SUBJECT: process.env.PUSH_VAPID_SUBJECT || ''
};