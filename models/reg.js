const mongoose=require('mongoose')


const regSchema=mongoose.Schema({
    email:String,
    pass:String,
    firstName:String,
    lastName:String,
    mobile:Number,
    image:String,
    status:{type:String,default:'Suspended'},
    emailStatus:{type:String,default:'Not verified'},
    aboutme:String,
    role:{type:String,default:'Public'}
})


module.exports=mongoose.model('reg',regSchema)