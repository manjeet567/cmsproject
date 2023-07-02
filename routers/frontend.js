const router=require('express').Router()
const regc=require('../controllers/regcontroller')
const multer=require('multer')

function handlerole(req,res,next){
    if(req.session.role=='Pvt'){
        next()
    }else{
        res.send("You don't have right to see this page")
    }
}



let storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/upload')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})

let upload=multer({
    storage:storage,
    limits:{fieldSize:(1024*1024*4)}
})


function handlelogin(req,res,next){
    if(req.session.manJeet){
        next()
    }else{
        res.redirect('/login')
    }
}


router.get('/',handlelogin,regc.homepage)
router.get('/reg',regc.regformshow)
router.post('/reg',regc.reginsert)
router.get('/login',regc.loginshow)
router.post('/login',regc.logininsert)
router.get('/logout',regc.logout)
router.get('/emailverify/:email',regc.emailverify)
router.get('/verification',regc.verification)
router.get('/profile',handlelogin,regc.profile)
router.post('/profile',upload.single('img'),regc.profileupdate)
router.get('/profileshow',regc.edit)
router.get('/testi',handlelogin,handlerole,regc.testi)
router.get('/forgotpassword',regc.forgotshow)
router.get('/forgotpasswordresetlink/:email',regc.forgotlink)
router.post('/forgotpasswordresetlink/:email',regc.forgotpasswordchange)
router.post('/forgotpassword',regc.forgotdata)
router.get('/changepassword',handlelogin,regc.changepasswordshow)
router.post('/changepassword',regc.changepassdata)
router.get('/profiledetaileshow/:id',handlelogin,handlerole,regc.peofiledetaileshow)

module.exports=router