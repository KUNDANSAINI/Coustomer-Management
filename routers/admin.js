const router=require('express').Router()
const registerc=require('../controllers/registercontroller')
const blogc=require('../controllers/blogcontroller')
const multer=require('../middlewere/multer')
const loginsession=require('../middlewere/loginsession')

router.get('/dashbord',loginsession,blogc.admindashboard)
router.get('/logout',registerc.adminlogout)
router.get('/allblog',blogc.adminallblogs)
router.get('/adminblogdelete/:id',blogc.adminblogdelete)
router.get('/statusupdate/:id',blogc.statusupdate)








module.exports=router