const mongoose=require('mongoose')


const blogSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    queots:{
        type:String,
        required:true        
    },
    postedBy:{
        type:String,
        required:true
    },
    postedDate:{
        type:Date,
        required:true,
        default:new Date()
    },
    img:{
        type:String,
    },
    status:{
        type:String,
        default:'Published',
        required:true
    }
})

module.exports=mongoose.model('blog',blogSchema)