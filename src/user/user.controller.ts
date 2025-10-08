import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import Exc from '../utill/exc.utill'
import userModel from "./user.model"
import UserModel from "./user.model"
import {Request,Response} from 'express'
import { UserInterface } from './user.interface'
import { AuthInterface } from '../middleware/guard.middleware'

const FOURTEEN_MINUTE=840000
const SIX_DAYS = 518400000




const getToken = (user:UserInterface)=>{
   const payload = {
	 id:user._id,
	 fullname:user.fullname,
	 email:user.email,
    phone:user.phone,
    role: user.role,
    
   }

   const accessToken = jwt.sign(payload,process.env.JWT_SECRET as string,{expiresIn:'15m'})
   const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET as string,{expiresIn:'7d'})
   
   return {
      accessToken,
      refreshToken
   }
}

export const fetchUser = (req:Request,res:Response)=>{
	res.send('hello Developer')
}

export const signup = Exc(async(req:Request,res:Response)=>{
      const newUser = new UserModel(req.body)
      await newUser.save()
      res.json({
         message:'signup success'
      })
})

export const login = Exc(async (req:Request,res:Response)=>{
   console.log(process.env.DEV_ENV)
   const {email,password} = req.body
   const user:UserInterface | null = await userModel.findOne({email})


   if(!user)
	return res.status(404).send('user not found')
   
   const isLogin = await bcrypt.compare(password,user.password)

   if(!isLogin)
	 res.status(401).send('incorrect password')

//    const accessToken = await jwt.sign(payload,process.env.JWT_SECRET,{
// 	 expiresIn:'15m'
//    })
   
   const {refreshToken,accessToken}=getToken(user)

  res.cookie('accessToken', accessToken, {
		maxAge: FOURTEEN_MINUTE,
		domain: process.env.NODE_ENV === "dev" ?"localhost":process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})
	res.cookie('refreshToken', refreshToken, {
		maxAge: SIX_DAYS,
		domain: process.env.NODE_ENV === "dev" ? "localhost":process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})

   return res.json({
	  message:'Login succcess',
     role:user.role
   })

})

export const logout = Exc((req: Request, res: Response) => {
   res.cookie('accessToken', null, {
		maxAge: 0,
		domain: process.env.NODE_ENV === "dev" ? "localhost" : process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})
	res.cookie('refreshToken', null, {
		maxAge: 0,
		domain: process.env.NODE_ENV === "dev" ? "localhost" : process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})

	res.json({message: 'Logout success !'})

  return res.json({
    message: 'Logout success',
  });
});



export const session = Exc((req:AuthInterface,res:Response)=>{
   return res.json(req.user)
}) 
 
