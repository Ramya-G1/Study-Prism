const jwt = require('jsonwebtoken')
const JWT_SECRET="wku3ey2876et623g3uhj24rb387";
const mongoose = require('mongoose')
const Student = mongoose.model("Student")
module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //authorization for a student to sign in
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            console.log("you must be login")
         return   res.status(401).json({error:"you must be logged in"})
        }
        const {_id} = payload
       Student.findById(_id).then(studentdata=>{
            req.student = studentdata
            next()
        })  
    })
}