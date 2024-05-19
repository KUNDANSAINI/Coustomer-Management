const express=require('express')
const app=express()
app.use(express.urlencoded({extended:false}))
const userRouter=require('./routers/users')
const adminRouter=require('./routers/admin')
const mongoose=require('mongoose')
const session = require('express-session')
mongoose.connect('mongodb://127.0.0.1:27017/nodecms').then(()=>{console.log('connected to DB!!')}).catch((error)=>{console.log(error.message)})
require('dotenv').config()





app.use(session({
    secret:process.env.KEY,
    resave:false,
    saveUninitialized:false
}))
app.use(userRouter)
app.use('/admin',adminRouter)
app.use(express.static('public'))
app.set('view engine','ejs')
app.listen(5000,()=>{console.log('Server Is Running On Port 5000')})