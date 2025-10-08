import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import UserRouter from './user/user.routes';
import ProductsRouter from './products/products.routes';

const app = express();


app.use(
  cors({
    origin: 'https://ecom-ui-seven.vercel.app',
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/', (req: Request, res: Response) => {
  res.send('hello');
});

app.use('/auth', UserRouter);
app.use('/products', ProductsRouter);

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URL as string);
      console.log('✅ MongoDB connected');
      isConnected = true;
    } catch (err) {
      console.error('❌ MongoDB connection error:', err);
      throw err;
    }
  }
}


export default async function handler(req: Request, res: Response) {
  await connectDB(); 
  return app(req, res);
}
