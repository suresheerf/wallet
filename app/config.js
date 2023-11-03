import { config } from "dotenv";
config();

export const NODE_ENV= process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3007;
export const DBURI = process.env.DBURI || 'mongodb://localhost:27017/wallet';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';
export const JWT_SECRET = process.env.JWT_SECRET;