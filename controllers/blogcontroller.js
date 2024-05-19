const blogTable=require('../models/blog')


exports.allblog=async(req,res)=>{
    const image=req.session.img
    const username=req.session.username
    const fildes=username.split('@')
    const loginame=fildes[0]
    //console.log(username)
    const alldata=await blogTable.find({status:'Published'})
    //console.log(alldata)
    res.render('allblogs.ejs',{loginame,alldata,image})
}

exports.myblog=async(req,res)=>{
    const message=req.params.mess
    const image=req.session.img
    const loginame=req.session.username
    const data=await blogTable.find({postedBy:loginame})
    //console.log(data)
    res.render('myblog.ejs',{loginame,message,data,image})
}

exports.blogformshow=(req,res)=>{
    // console.log(req.session)
    const loginame=req.session.username
    const image=req.session.img
    res.render('blogform.ejs',{loginame,image})
}

exports.blogform=(req,res)=>{
    const loginame=req.session.username
    const image=req.session.img
    const {btitle,bdecs}=req.body
    if(req.file){
        const filename=req.file.filename
        var newRecord=new blogTable({title:btitle,queots:bdecs,postedBy:loginame,img:filename})
    }else{
        var newRecord=new blogTable({title:btitle,queots:bdecs,postedBy:loginame,img:'code.jpg'})
    }
   // console.log(newRecord)
    newRecord.save()
    res.redirect('/myblog/Data Successfully Add')
}

exports.blogupdateform=async(req,res)=>{
    const id=req.params.id
    const loginame=req.session.username
    const image=req.session.img
    const updatedata=await blogTable.findById(id)
    //console.log(updatedata)
    res.render('blogupdateform.ejs',{loginame,updatedata,image})
}

exports.blogupdate=async(req,res)=>{
    const {btitle,bdecs}=req.body
    const id=req.params.id
    if(req.file){
        const filename=req.file.filename
    await blogTable.findByIdAndUpdate(id,{title:btitle,queots:bdecs,img:filename})
    }else{
        await blogTable.findByIdAndUpdate(id,{title:btitle,queots:bdecs})
    }
    res.redirect('/myblog/Blog Successfully Update')
}

exports.delete=async(req,res)=>{
    const id=req.params.id
    await blogTable.findByIdAndDelete(id)
    res.redirect('/myblog/Successfully Deleted')
}

exports.adminallblogs=async(req,res)=>{
    const alldata=await blogTable.find()
    //console.log(alldata)
    res.render('admin/blogdata.ejs',{alldata})
}

exports.adminblogdelete=async(req,res)=>{
    const id=req.params.id
    await blogTable.findByIdAndDelete(id)
    res.redirect('/admin/allblog')
}

exports.admindashboard=(req,res)=>{
    res.render('admin/dashbord.ejs')
}

exports.statusupdate=async(req,res)=>{
    const id=req.params.id
    const statusdata=await blogTable.findById(id)
    //console.log(statusdata)
    if(statusdata.status=='Published'){
        await blogTable.findByIdAndUpdate(id,{status:'Unpublished'})
    }else{
        await blogTable.findByIdAndUpdate(id,{status:'Published'})
    }
    res.redirect('/admin/allblog')
}
