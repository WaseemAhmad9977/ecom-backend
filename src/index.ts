import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
mongoose.connect(process.env.MONGODB_URL as string).then(()=>console.log('connected')).catch((err)=>console.log(err))

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import cors from 'cors'

import express,{Request,Response} from 'express'

const app = express()
app.listen(8080)


app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))

app.use(bodyParser.urlencoded({
  extended:false
}))

app.use(bodyParser.json())

app.use(cookieParser()); 

app.get('/',(req:Request,res:Response)=>{
  res.send("hello")
})

import UserRouter from './user/user.routes'
app.use("/auth",UserRouter)
 

import ProductsRouter from './products/products.routes'
app.use('/products', ProductsRouter)