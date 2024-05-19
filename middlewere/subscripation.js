function subscripation(req,res,next){
    if(req.session.sub=='subscripation'){
        next()
    }else{
        res.send('Please Give This Subscripation For Us!!!')
    }
}


module.exports=subscripation