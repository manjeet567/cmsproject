const express=require('express')
const app=express()
app.use(express.urlencoded({extended:false}))
require('dotenv').config()
const adminrouter=require('./routers/admin')
const frontendrouter=require('./routers/frontend')
const session=require('express-session')
const mongoose=require('mongoose')
mongoose.connect(process.env.DB_URL+'/'+process.env.DB_NAME)



app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(frontendrouter)
app.use('/admin',adminrouter)
app.use(express.static('public'))
app.set('view engine','ejs')
app.listen(process.env.PORT,()=>{console.log('server is running')})