const mongoose=require('mongoose')
const studentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    collegeId:{
        type:String,
        required:true
    },
    semester:{
        type:Number,
        required:true
    },
    collegeName:{
        type:String,
        required:true
    },
    branchName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    isVerified:{
         type: Boolean,
         default: false 
    },
    password:{
        type:String,
        required:true
    },
    resetToken :String,
    expireToken:Date
})
mongoose.model("Student",studentSchema)