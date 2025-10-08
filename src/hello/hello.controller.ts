import HelloModel from './hello.model'
import { Request, Response } from 'express'

export const fetchHello = (req: Request, res: Response)=>{
	res.send("Hello")
}