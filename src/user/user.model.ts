import bcrypt from  'bcrypt'
import {Schema,model} from 'mongoose'

const userSchema = new Schema({
	fullname:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type: String,
        default: 'admin',
        enum: ['user','admin']
    },
   
  
},{timestamps:true})

userSchema.pre('save',async function(next){
    const count =await model('User').countDocuments({email:this.email})
    if(count)
        throw next(new Error('user already exist!'))
    next()
})

userSchema.pre('save',async function(next){
    const encrypted = await bcrypt.hash(this.password.toString(),12)
    this.password=encrypted
    next()
})

const userModel = model('User',userSchema)
export default userModel