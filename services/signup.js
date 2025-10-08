import dotenv from 'dotenv'
dotenv.config()
let db = null
import bcrypt from 'bcrypt'
import inquirer from "inquirer";
import chalk from "chalk";
import { validate } from "uuid";
const log = console.log
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URL)
console.log(process.env.MONGODB_URL)

async function connectDB() {
  try {
    await client.connect()
    db = client.db() // DB is taken from URL (ecommerce)
    log(chalk.green("✅ Connected to MongoDB Atlas"))
  } catch (err) {
    log(chalk.red("❌ Failed to connect database: "), err.message)
    process.exit(1)
  }
}

log(chalk.bgRed.white.bold.underline('🌟 Admin Signup Console 🌟'))

const options=[
    {
        type:'list',
        name:'role',
        message:'Press arrow up and down key to choose.',
        choices:[
            chalk.green("user"),
            chalk.blue("admin"),
            chalk.red("exit")
        ]
    }
]


const input=[
    {
        type:'input',
        name:'fullname',
        message:'Enter your fullname ?',
        validate:(input)=>{
            return input.length>0 ? true:'Name is required'
        }
        

    },
    {
        type:'input',
        name:'email',
        message:'Enter your Email ?',
        validate:(input)=>{
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!input.length)
                return 'Email is required!'
            if(!emailRegex.test(input))
                return 'Invalid email'
            return true
        }
    },
    {
        type:'input',
        name:'mobile',
        message:'Enter your mobile ?',
        validate:(input)=>{
           const mobileRegex = /^[6-9]\d{9}$/;
           if(!input.length)
            return "Invalif phone number!"
           
           if(!mobileRegex.test(input))
            return "Invalid Phone number!"

           return true 
        }
    },
    {
        type:"input",
        name:'password',
        message:'Enter your Password ?',
        validate:(input)=>{
          if(!input.length)
            return "Password is required!"
         if(input.length<6)
            return 'Password should be atleast 6 character!'

         return true
        }
    }
]

const addUser = async ()=>{
   try{
      const user = await inquirer.prompt(input)
      
      user.role ='user'
      user.password =await bcrypt.hash(user.password,12)
      const userCollection = db.collection('users')
      await userCollection.insertOne(user)
      log(chalk.green('user has been created !'))
      process.exit()                                      
   }
   catch(err)
   {
      log(chalk.red('failed to create user please consult to developer!'))
   }
    
}

const addAdmin = async ()=>{
    try{
        const user = await inquirer.prompt(input)
        user.role='admin'
        user.password=await bcrypt.hash(user.password,12)
        const userCollection = db.collection('users')
        await userCollection.insertOne(user)
        log(chalk.green('Admin is created'))
        process.exit()
    }
    catch(err)
    {
       log(chalk.red("Failed to create admin please consult to the developer!"))
    }
}

const exit = async ()=>{
    log(chalk.red('GoodBye! Exiting the program.'))
    process.exit()
}


const createUser = async ()=>{
    const option = await inquirer.prompt(options)
    if(option.role.includes("user"))
        return addUser()

    if(option.role.includes("admin"))
        return addAdmin()

    if(option.role.includes("exit"))
        return exit()
}

createUser()
connectDB() 