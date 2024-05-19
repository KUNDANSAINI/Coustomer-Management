const registerTable = require('../models/register')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()



exports.signupshow = (req, res) => {
    res.render('signup.ejs', { message: '' })
}

exports.signup = async (req, res) => {
    try {
        const { fname, lname, email, pass, dob, mob, gender } = req.body
        const conpass = await bcrypt.hash(pass, 10)
        const emaildata = await registerTable.findOne({ email: email })
        //console.log(emaildata)
        if (emaildata == null) {
            if (req.file) {
                const filename = req.file.filename
                const newRecord = registerTable({ fname: fname, lname: lname, email: email, pass: conpass, dob: dob, mob: mob, gender: gender, img: filename })
                newRecord.save()
                const userid = newRecord.id

                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                        user: "boyfake051@gmail.com",
                        pass: "tdzd nbbz zzkx kxwa",
                    },
                });

                await transporter.sendMail({
                    from: 'boyfake051@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: "Account Verifection Link nodecms", // Subject line
                    //text: "Hello", // plain text body
                    html: `<a href=http://localhost:5000/emailverifiy/${userid}>click to verification</a>`, // html body
                });
                res.render('signup.ejs', { message: 'User Is Successfully Created& Please Check gmail For Verification Account' })
            }
            else {
                const newRecord = registerTable({ fname: fname, lname: lname, email: email, pass: conpass, dob: dob, mob: mob, gender: gender, img:'code.jpg' })
                newRecord.save()
                const userid = newRecord.id

                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                        user: "boyfake051@gmail.com",
                        pass: "tdzd nbbz zzkx kxwa",
                    },
                });

                await transporter.sendMail({
                    from: 'boyfake051@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: "Account Verifection Link nodecms", // Subject line
                    //text: "Hello", // plain text body
                    html: `<a href=http://localhost:5000/emailverifiy/${userid}>click to verification</a>`, // html body
                });
                res.render('signup.ejs', { message: 'User Is Successfully Created& Please Check gmail For Verification Account' })
            }
        }
        else {
            //res.send('email is already use')
            res.render('signup.ejs', { message: 'Email Is Already Registered' })
        }
    } catch (error) {
        console.log(error.message)
    }
}

exports.emailverifiy = async (req, res) => {
    const id = req.params.id
    await registerTable.findByIdAndUpdate(id, { status: 'Active' })
    res.render('message.ejs', { message: 'Account Successfully Active' })
}

exports.loginshow = (req, res) => {
    res.render('login.ejs', { message: '' })
}

exports.login = async (req, res) => {
    const { username, pass } = req.body
    const usercheck = await registerTable.findOne({ email: username })
    //console.log(usercheck)
    if (usercheck != null) {
        const comparepass = await bcrypt.compare(pass, usercheck.pass)
        //console.log(comparepass)
        if (comparepass) {
            if (usercheck.status == 'Active') {
                req.session.isAuth = true
                req.session.username = username
                req.session.sub = usercheck.sub
                req.session.img=usercheck.img
                if(usercheck.email=='admin@123gmail.com'){
                    res.redirect('admin/dashbord')
                }else{
                    res.redirect('/allblogs')
                }
            } else {
                res.render('login.ejs', { message: 'Your Account Is Suspended. Please Check Your Email To Active' })
            }
        } else {
            res.render('login.ejs', { message: 'Wrong Password' })
        }
    } else {
        res.render('login.ejs', { message: 'Wrong Username/Email' })
    }
}

exports.forgotform = (req, res) => {
    res.render('forgotform.ejs', { message: '' })
}

exports.forgot = async (req, res) => {
    const { email } = req.body
    const emailcheck = await registerTable.findOne({ email: email })
    //console.log(emailcheck)
    if (emailcheck != null) {
        let payload={username:emailcheck.email}
        //console.log(payload)
        const token=jwt.sign(payload,process.env.SKEY,{expiresIn:'5m'})
        //console.log(token)
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: "boyfake051@gmail.com",
                pass: "tdzd nbbz zzkx kxwa",
            },
        });
        // console.log('SMTP server connected')
        await transporter.sendMail({
            from: 'boyfake051@gmail.com', // sender address
            to: email, // list of receivers
            subject: "forgot password link", // Subject line
            //text: "Hello", // plain text body
            html: `<a href=http://localhost:5000/forgotpassword/${emailcheck.id}/${token}>click to verification</a>`, // html body
        });
        res.render('forgotform.ejs', { message: 'forgot link send to your email. please check for email' })
    } else {
        res.render('forgotform.ejs', { message: 'Please Send To Crrorct Email' })
    }
}

exports.forgotpasswordform = (req, res) => {
    const token=req.params.ee
    //console.log(token)
    if(token){
        jwt.verify(token,process.env.SKEY,(error,username)=>{
            if(error){
                res.render('tokenmessage.ejs',{message:'Forgot Password Link Has Been Expried'})
            }else{
                res.render('forgotpasswordform.ejs', { message: '' })
            }
        })
    }
}

exports.forgotpassword = async (req, res) => {
    const { npass, cpass } = req.body
    //console.log(req.body)
    const id = req.params.id
    if (npass == cpass) {
        const bypass = await bcrypt.hash(npass, 10)
        //console.log(bypass)
        await registerTable.findByIdAndUpdate(id, { pass: bypass })
        res.render('forgotmessage.ejs')
    } else {
        res.render('forgotpasswordform.ejs', { message: 'Password Not Matched' })
    }
}

exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

exports.changepasswordform = (req, res) => {
    const loginame = req.session.username
    const image=req.session.img
    //console.log(loginame.pass)
    res.render('changepasswordform.ejs', { loginame, message: '',image })
}

exports.changepassword = async (req, res) => {
    const loginame = req.session.username
    const image=req.session.img
    const { cpass, npass, copass } = req.body
    const userdata = await registerTable.findOne({ email: loginame })
    // console.log(userdata.pass)
    const passwordcompare = await bcrypt.compare(cpass, userdata.pass)
    //console.log(passwordcompare)
    var newpass = await bcrypt.hash(npass, 10)
    //console.log(newpass)
    if (npass == copass) {
        if (passwordcompare) {
            await registerTable.findByIdAndUpdate(userdata.id, { pass: newpass })
            req.session.destroy()
            res.render('changepasswordmess.ejs')
        } else {
            res.render('changepasswordform.ejs', { loginame, message: 'Current Password Not Match',image })
        }
    } else {
        //res.send('Confirm Password Is Wrong')
        res.render('changepasswordform.ejs', { loginame, message: 'Confirm Password Not Match',image })
    }
}

exports.profileupdate = async (req, res) => {
    const message = req.params.mess
    const loginame = req.session.username
    const image=req.session.img
    const prodata = await registerTable.findOne({ email: loginame })
    //console.log(prodata)
    res.render('profileupdate.ejs', { loginame, prodata, message ,image})
}

exports.profile = async (req, res) => {
    //console.log(req.file)
    const { ffname, lname, dob, mob, gender } = req.body
    const id = req.params.id
    if(req.file){
        const filename=req.file.filename
        await registerTable.findByIdAndUpdate(id, { fname: ffname, lname: lname, dob: dob, mob: mob, gender: gender ,img:filename})        
    }else{
        await registerTable.findByIdAndUpdate(id, { fname: ffname, lname: lname, dob: dob, mob: mob, gender: gender })
    }
    res.redirect('/myprofile/Profile Is Successfully Update')
}

exports.adminlogout=(req,res)=>{
    req.session.destroy()
    res.redirect('/')
}