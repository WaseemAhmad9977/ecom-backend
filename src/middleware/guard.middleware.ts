import { NextFunction, Request,Response } from "express"
import jwt from 'jsonwebtoken'
import Exc from "../utill/exc.utill"
import crypto from 'crypto';

export interface AuthInterface extends Request{
    user:any
}

const expireSession = (res:Response)=>{
   res.cookie('accessToken',null,{
        maxAge:0,
        domain:process.env.DEV_ENV==='dev'?'localhost':process.env.DOMAIN,
        secure:process.env.DEV_ENV==='dev'?false:true,
        httpOnly:true
   }),
   res.cookie('refreshToken',null,{
        maxAge:0,
        domain:process.env.DEV_ENV ==='dev'?'localhost':process.env.DOMAIN,
        secure:process.env.DEV_ENV==='dev'?false:true,
        httpOnly:true
   })

   res.status(400).json({message:'Bad Request'})
}

export const adminGuard =Exc(async (req:AuthInterface,res:Response,next:NextFunction)=>{
     const {accessToken}=req.cookies
     
     if(!accessToken)
        return expireSession(res)
      
     
     const payload:any=await jwt.verify(accessToken,process.env.JWT_SECRET as string)
     
     if(payload.role!=='admin')
        return expireSession(res)

     req.user=payload;
   //   console.log(req.user)
     next()
})

export const userGuard=Exc(async (req:AuthInterface,res:Response,next:NextFunction)=>{
    const {accessToken}=req.cookies
    if(!accessToken)
      return expireSession(res)

    const payload:any=await jwt.verify(accessToken,process.env.JWT_SECRET as string)

    if(payload.role !== 'user')
      return expireSession(res)

    req.user = payload
    next()
    
})

export const AdminUserGuard=Exc(async (req:AuthInterface,res:Response,next:NextFunction)=>{
   const {accessToken}=req.cookies
   if(!accessToken)
      return expireSession(res)

   const payload:any = await jwt.verify(accessToken,process.env.JWT_SECRET as string)
   
   if(payload.role !== 'admin' && payload.role !=='user')
      return expireSession(res)

   req.user = payload
   next()
})
