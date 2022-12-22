const mongoose=require("mongoose");
const mongoURL='mongodb+srv://subhajit:r4P7M7Xuher2Iflt@cluster0.6iidrns.mongodb.net/?retryWrites=true&w=majority'
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
// app.use(express.static('public/build'))
mongoose.connect(mongoURL)
.then(()=>{
    console.log('dbconnect')
}).catch((err)=>{
    console.log(err)
})

let userschma=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
})
let winerschma=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,

        },
        winer12:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        }
    },
    {timestamps: true }
    
)
const usermodel=mongoose.model('usermodel',userschma)
const winmodel=mongoose.model('winmodel',winerschma)


app.get('/', async(req, res)=> {
    let users=await usermodel.find()
    res.json(users)
  })
app.post('/',async(req,res)=>{
    let users=await usermodel.create(req.body)
    
    res.json(users)
})
app.post('/login',async(req,res)=>{
    let data=req.body
    let user=await usermodel.findOne({email:data.email})
    if(user){
        if(user.password==data.password){
            res.cookie('islogedin',true,{httpOnly:true})
            delete user.password
            res.json({
                message:'success fully login',
                user1:user
            })
        }
        else{
            res.status(500).json({
                message:'password invalid'
            })
        }
    }
    else{
        res.status(500).json({
            message:'invalid email'
        })
    }
})
app.post('/feed11',async(req,res)=>{
    let data=req.body
    let lastplay=await winmodel.find({email:data.email})

    res.json(lastplay)
})
app.post('/feed',async(req,res)=>{
    let lastplay=await winmodel.create(req.body)
    console.log(lastplay)
    res.json(lastplay)
})

app.listen(process.env.PORT || 4000,()=>{
    console.log(`port is 4000`)
})

function protectRoute(req,res,next){
    if(req.cookies.islogedin){
        next()
    }
    else{
        res.status(500).json({
            message:'please login'
        })
    }
}