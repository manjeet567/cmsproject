const Reg=require('../models/reg')
const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer')

exports.homepage=async(req,res)=>{
const username=req.session.username
const record=await Reg.findOne({email:username})
const reg=await Reg.find()
res.render('index.ejs',{username,record,reg})
}
exports.regformshow=(req,res)=>{
res.render('reg.ejs',{username:'hello'})
}
exports.reginsert=async(req,res)=>{
const{email}=req.body
const pass=req.body.pass
const cpass=await bcrypt.hash(pass,10)
try{
const emailcheck=await Reg.findOne({email:email})
if(emailcheck==null){
const record=new Reg({email:email,pass:cpass})
record.save()
let testAccount = await nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user:'lavaboyyttt@gmail.com', // generated ethereal user
    pass: 'phtnkkrfuwwyhrue', // generated ethereal password
  },
});
console.log('connected to smtp server')
let info = await transporter.sendMail({
    from: 'lavaboyyttt@gmail.com', // sender address
    to: email, // list of receivers
    subject:'Email verification', // Subject line
    //text: "Hello world?", // plain text body
    html: `<a href='http://localhost:8000/emailverify/${email}' >click to verify </a>`, // html body
  });
res.redirect('/verification')
}else{
    res.send('email already taken')
}
}catch(error){
   res.send('Bad Internet Connection or Internal Error')
}
}
exports.loginshow=(req,res)=>{
res.render('login.ejs',{username:'hello',mess:''})
}
exports.logininsert=async(req,res)=>{
const{email,pass}=req.body
const record=await Reg.findOne({email:email})
if(record!==null){
if(record.emailStatus!=='Not verified'){
if(record.status!=="Suspended"){
if(record!==null){
    const cpass=await bcrypt.compare(pass,record.pass)
    if(cpass){
        req.session.manJeet=true
        req.session.username=email
        req.session.role=record.role
        if(email=='lavaboyyttt@gmail.com'){
   res.redirect('/admin/dashboard')
}else{
    res.redirect('/')
}
}else{
    res.render('login.ejs',{username:'hello',mess:"wrong password"})
}
}else{
    res.render('login.ejs',{username:'hello',mess:"Email dosen't exist"})
}
}else{
    res.send('your account is suspended')
}
}else{
    res.send('Email verification is pending')
}
}else{
    res.render('login.ejs',{username:'hello',mess:"Email dosen't exist"})
}
}
exports.logout=(req,res)=>{
req.session.destroy()
res.redirect('/login')
}
exports.adminloginpage=(req,res)=>{
res.render('admin/login.ejs',{mess:''})
}
exports.dashboard=(req,res)=>{    
res.render('admin/dashboard.ejs')
}
exports.users=async(req,res)=>{
const record=await Reg.find()
res.render('admin/users.ejs',{record})
}

exports.emailverify=async(req,res)=>{
const email=req.params.email
const record=await Reg.findOne({email:email})
const id=record.id
await Reg.findByIdAndUpdate(id,{status:'Active',emailStatus:'Verified'})
res.send('you have successfuly verified your email')
}
exports.verification=(req,res)=>{
    res.render('verifypage.ejs',{username:'hello'})
    }

exports.profile=async(req,res)=>{
const username=req.session.username
const record= await Reg.findOne({email:username})
res.render('profile.ejs',{username:req.session.username,record})
}
exports.profileupdate=async(req,res)=>{
const{fname,lname,mobile,aboutme}=req.body
const username=req.session.username
const record=await Reg.findOne({email:username})
const id=record.id
if(req.file){
    const filename=req.file.filename
    await Reg.findByIdAndUpdate(id,{firstName:fname,lastName:lname,mobile:mobile,image:filename,aboutme:aboutme})
}else{
await Reg.findByIdAndUpdate(id,{firstName:fname,lastName:lname,mobile:mobile,aboutme:aboutme})
}
res.redirect('/profileshow')
}

exports.edit=async(req,res)=>{
    const username=req.session.username
    const record=await Reg.findOne({email:username})

res.render('editprofile.ejs',{record,username})
}

exports.userstatusupdate=async(req,res)=>{
const id=req.params.id
const record=await Reg.findById(id)
let currentstatus=null
let currentemailstatus=null
if(record.status=='Suspended'){
    currentstatus='Active'
    currentemailstatus='Verified'
}else{
    currentstatus='Suspended'
    currentemailstatus='Not verified'
}
await Reg.findByIdAndUpdate(id,{status:currentstatus,emailStatus:currentemailstatus})
res.redirect('/admin/users')
}

exports.userroleupdate=async(req,res)=>{
const id=req.params.id
const record=await Reg.findById(id)
let currentrole=null
if(record.role=='Public'){
    currentrole='Pvt'
}else{
    currentrole='Public'
}
await Reg.findByIdAndUpdate(id,{role:currentrole})
res.redirect('/admin/users')
}

exports.testi=(req,res)=>{
res.render('testi.ejs')
}
exports.forgotshow=(req,res)=>{
res.render('forgotform.ejs',{username:'hello'})
}
exports.forgotlink=(req,res)=>{
const email=req.params.email   
console.log(email) 
res.render('passwordresetform.ejs',{username:'hello',email,mess:''})
}
exports.forgotpasswordchange=async(req,res)=>{
const{npass,cpass}=req.body
const email=req.params.email
const changepassword=await bcrypt.hash(npass,10)
const record=await Reg.findOne({email:email})

if(record!==null){
    const id=record.id
if(npass==cpass){
await Reg.findByIdAndUpdate(id,{pass:changepassword})
res.render('login.ejs',{username:'hello',mess:'Password has been changed please do freash login'})
}else{
    res.render('passwordresetform.ejs',{username:'hello',email,mess:'Confirm password shold be same to new password'})
}
}else{
    res.send('Account not found')
}
}
exports.forgotdata=async(req,res)=>{
const{email}=req.body
try{
let testAccount = await nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user:'lavaboyyttt@gmail.com', // generated ethereal user
    pass: 'phtnkkrfuwwyhrue', // generated ethereal password
  },
});
console.log('connected to smtp server')
let info = await transporter.sendMail({
    from: 'lavaboyyttt@gmail.com', // sender address
    to: email, // list of receivers
    subject:'Forgot password reset', // Subject line
    //text: "Hello world?", // plain text body
    html: `<a href='http://localhost:8000/forgotpasswordresetlink/${email}' >click to reset password </a>`, // html body
  });
  res.send('Password reset link sent at your email account')
}catch(error){
    res.send('Bad Internet Connection OR Internal Error')
}
}
exports.changepasswordshow=async(req,res)=>{
    const username=req.session.username
    const record=await Reg.findOne({email:username})
res.render('changepassform.ejs',{username:username,record,mess:''})
}
exports.changepassdata=async(req,res)=>{
const{cpass,npass}=req.body
const username=req.session.username
const record=await Reg.findOne({email:username})
const pass=record.pass
const bcrptpass=await bcrypt.compare(cpass,pass)
//console.log(bcrptpass)
//console.log(pass,record.id)
if(bcrptpass){
    const changedpass=await bcrypt.hash(npass,10)
    await Reg.findByIdAndUpdate(record.id,{pass:changedpass})
    req.session.destroy()
    res.render('login.ejs',{mess:'Password has been changed please do fresh login',username:"hello"})
}else{
    res.render('changepassform.ejs',{username:username,record,mess:'Current password not matched'})
}
}
exports.peofiledetaileshow=async(req,res)=>{
const id=req.params.id
//console.log(id)
const reg=await Reg.findById(id)
//console.log(reg)
const username=req.session.username
const record=await Reg.findOne({email:username})
res.render('profilepage.ejs',{username,reg,record})
}
exports.adminpasschangeform=(req,res)=>{
    res.render('admin/adminpasschange.ejs',{mess:''})
}
exports.adminpasschange=async(req,res)=>{
const{cpass,npass}=req.body
const username=req.session.username
const record=await Reg.findOne({email:username})
const id=record.id
const comparepass=await bcrypt.compare(cpass,record.pass)
if(comparepass){
    const convertpass=await bcrypt.hash(npass,10)
    await Reg.findByIdAndUpdate(id,{pass:convertpass})
    req.session.destroy()
    res.render('admin/login.ejs',{mess:'password changed successfully please do fresh login'})
}else{
    res.render('admin/adminpasschange.ejs',{mess:'wrong password'})
}
}
