import express from 'express'
const HelloRouter = express.Router()
import { fetchHello } from './hello.controller'

HelloRouter.get('/', fetchHello)

export default HelloRouter