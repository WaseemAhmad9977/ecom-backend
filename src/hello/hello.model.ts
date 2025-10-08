import { model, Schema } from 'mongoose'

const schema = new Schema({
	
},{timestamps: true})

const HelloModel = model('Hello', schema)
export default HelloModel