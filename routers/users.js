const router=require('express').Router()
const registerc=require('../controllers/registercontroller')
const blogc=require('../controllers/blogcontroller')
const loginsession=require('../middlewere/loginsession')
const multer=require('../middlewere/multer')
const subscripation=require('../middlewere/subscripation')



router.get('/',registerc.loginshow)
router.post('/',registerc.login)
router.get('/signup',registerc.signupshow)
router.post('/signup',multer.single('img'),registerc.signup)
router.get('/emailverifiy/:id',registerc.emailverifiy)
router.get('/logout',registerc.logout)
router.get('/forgot',registerc.forgotform)
router.post('/forgot',registerc.forgot)
router.get('/forgotpassword/:id/:ee',registerc.forgotpasswordform)
router.post('/forgotpassword/:id',registerc.forgotpassword)
router.get('/allblogs',loginsession,blogc.allblog)
router.get('/myblog/:mess',loginsession,blogc.myblog)
router.get('/addblog',loginsession,blogc.blogformshow)
router.post('/addblog',multer.single('img'),blogc.blogform)
router.get('/update/:id',loginsession,blogc.blogupdateform)
router.post('/update/:id',multer.single('img'),blogc.blogupdate)
router.get('/blogdelete/:id',blogc.delete)
router.get('/changepassword',loginsession,registerc.changepasswordform)
router.post('/changepassword',registerc.changepassword)
router.get('/myprofile/:mess',loginsession,registerc.profileupdate)
router.post('/myprofile/:id',multer.single('img'),registerc.profile)



module.exports=router