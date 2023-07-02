const router=require('express').Router()
const regc=require('../controllers/regcontroller')
require('express-session')

function handlelogin(req,res,next){
    if(req.session.manJeet){
        next()
    }else{
        res.render('admin/login.ejs',{mess:''})
    }
}


router.get('/',regc.adminloginpage)
router.get('/dashboard',handlelogin,regc.dashboard)
router.get('/users',handlelogin,regc.users)
router.get('/userstatusupdate/:id',handlelogin,regc.userstatusupdate)
router.get('/userroleupdate/:id',handlelogin,regc.userroleupdate)
router.get('/adminpasschange',handlelogin,regc.adminpasschangeform)
router.post('/adminpasschange',regc.adminpasschange)
module.exports=router