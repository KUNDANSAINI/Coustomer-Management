const mongoose=require('mongoose')


const signupSchema=mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pass:{
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:true,
    },
    mob:{
        type:String,
        required:true,
    },
    createDate:{
        type:Date,
        required:true,
        default:new Date()
    },
    gender:{
        type:String,
    },
    status:{
        type:String,
        required:true,
        default:'Suspended'
    },
    sub:{
        type:String,
        default:'nosubscripation',
        required:true
    },
    img:{
        type:String
    }
})


module.exports=mongoose.model('signup',signupSchema)