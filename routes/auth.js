const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const crypto=require('crypto')
const studentAuthenticate=require('../middleware/studentAuthenticate');
const teacherAuthenticate = require('../middleware/teacherAuthenticate');
const Student=mongoose.model("Student");
const Teacher=mongoose.model("Teacher");
const StudentToken=mongoose.model("StudentToken");
const TeacherToken=mongoose.model("TeacherToken");
const {JWT_SECRET,SENDGRID_API,EMAIL,HOST}=require('../config/keys.js')
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const transport=nodemailer.createTransport(sendgridTransport({
      auth:{
          api_key:SENDGRID_API
      }
}))
//To signup a student
router.post('/studentSignUp',(req,res)=>{
    const {name,collegeId,semester,collegeName,email,password,branchName}=req.body;
    if(!name || !collegeId || !semester || !collegeName || !email || !password || !branchName){
        return res.status(422).json({error:'Fill all the fields'});
    }
    Student.findOne({email:email})
    .then((savedstudent)=>{
        if(savedstudent)  {
           return res.status(422).json({error:'Already email exists'})
        }
        //encryption of password
         bcrypt.hash(password,12).then(hashedpassword=>{
            const student=new Student({
                email:email,
                name:name,
                collegeName:collegeName,
                collegeId:collegeId,
                semester:semester,
                branchName:branchName,
                password:hashedpassword
            })
            //saving student details in database 
            student.save().then(student=>{
            //Generating a token to send verification email to student
                const token = new StudentToken({ _Id: student._id, token: crypto.randomBytes(16).toString('hex') })
               token.save(function (err) {
            if (err) { return res.json({error: err.message }) }
            var mailOptions = { from: 'noreplybuddy1@gmail.com', to: student.email, subject: 'Study Prism Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/studentconfirmation\/' + student.email + '\/' + token.token + '\n\nThank You!\n' };
            transport.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message })}
                return res.status(200).json({message:'A verification email has been sent to ' + student.email + '.',student:{email}})
            })
        })
            }).catch(err=>{
            console.log(err)
             })
        })
   })
   .catch(err=>{
    console.log(err);
    })
});
//To signin a student
router.post('/studentSignIn',(req,res)=>{
   const {email,password}=req.body;
   if(!email || !password){
       return res.status(422).json({error:"Fill all the fields"});
   }
   Student.findOne({email:email})
   .then((savedstudent)=>{
    if(!savedstudent)
    return res.status(422).json({error:"Please signup"})
    //compares the password with stored password in database
    bcrypt.compare(password,savedstudent.password).then((domatch)=>{
        var token="";
        if(domatch) {
            token=jwt.sign({_id:savedstudent._id},JWT_SECRET)
        }
        else{
        return res.status(422).json({error:"Incorrect Email or password"})
        }
        if (!savedstudent.isVerified) return res.status(401).send({ error: 'Your account has not been verified.' })
         const {_id,name,email,collegeId,collegeName,semester,branchName}=savedstudent;
         return res.status(200).json({token,student:{_id,name,email,collegeId,collegeName,semester,branchName}});
    })
   })
   .catch(err=>{
       console.log(err);
   })
});
//To signup a steacher
router.post('/teacherSignUp',(req,res)=>{
    const {name,collegeName,email,password}=req.body;
    if(!name || !collegeName || !email || !password){
        return res.status(422).json({error:'Fill all the fields'});
    }
    Teacher.findOne({email:email})
    .then((savedteacher)=>{
        if(savedteacher)  {
           return res.status(422).json({error:'Already email exists'})
        }
         //encryption of password
         bcrypt.hash(password,12).then(hashedpassword=>{
            const teacher=new Teacher({
                email:email,
                name:name,
                collegeName:collegeName,
                password:hashedpassword
            })
              //saving teacher details in database 
            teacher.save().then(teacher=>{
            //Generating a token to send verification email to teacher
                const token = new TeacherToken({ _Id: teacher._id, token: crypto.randomBytes(16).toString('hex') })
                token.save(function (err) {
                    if (err) { return res.json({ error: err.message }) }
                    var mailOptions = { from: 'noreplybuddy1@gmail.com', to: teacher.email, subject: 'Study Prism Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/teacherconfirmation\/' + teacher.email + '\/' + token.token + '\n\nThank You!\n' };
                    transport.sendMail(mailOptions, function (err) {
                        if (err) { return res.status(500).send({ msg: err.message })}
                        return res.status(200).json({message:'A verification email has been sent to ' + teacher.email + '.',teacher:{email}})
                    })
                })
            }).catch(err=>{
            console.log(err)
             })
        })
   })
   .catch(err=>{
    console.log(err);
    })
});
//To signin a student
router.post('/teacherSignIn',(req,res)=>{
   const {email,password}=req.body;
   if(!email || !password){
       return res.status(422).json({error:"Fill all the fields"});
   }
   Teacher.findOne({email:email})
   .then((savedteacher)=>{
    if(!savedteacher)
    return res.status(422).json({error:"Please signup"})
    //compares password with stored password in database
    bcrypt.compare(password,savedteacher.password).then((domatch)=>{
        var token="";
        if(domatch) {
            token=jwt.sign({_id:savedteacher._id},JWT_SECRET)
        }
        else{
        return res.status(422).json({error:"Incorrect Email or password"})
        }
        if (!savedteacher.isVerified) return res.status(401).send({error: 'Your account has not been verified.' })
         const {_id,name,email,collegeName}=savedteacher;
         return res.json({token,teacher:{_id,name,email,collegeName}});
    })
   })
   .catch(err=>{
       console.log(err);
   })
});
//To verify the student with the verification mail sent to  student
router.get('/studentconfirmation/:email/:token',(req,res)=>{
    StudentToken.findOne({ token: req.params.token }, function (err, token) {
        if (!token){                                            //checks verification token is active or expired.
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<div>Your verification link may have expired.</div><br /><br /><a href="${HOST}/resend-studentverificationmail/${req.params.email}">Click Here to resend verification mail</a>: `);
            res.end();        }
        else{                                                  //checks whether student already have account or not
            Student.findOne({ _id: token._Id, email: req.params.email }, function (err, student) {
                if (!student){
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<div>We were unable to find a student for this verification. Please SignUp!</div><br /><br /><a href="${EMAIL}/studentsignup">Click Here to sign in</a>: `);
                    res.end(); 
                }
                else if (student.isVerified){                    //checks is the student account is already verified 
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<div>Your account has been already verified .Please Login </div><br /><br /><a href="${EMAIL}/studentsignin">Click Here to sign in</a>: `);
                    res.end(); 
                }
                else{                                            //verifys the student account.
                    student.isVerified = true;
                    student.save(function (err) { 
                        if(err){
                            return res.status(500).send({msg: err.message});
                        }
                        else{
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.write(`<div>Your account has been successfully verified</div><br /><br /><a href="${EMAIL}/studentsignin">Click Here to sign in</a>: `);
                            res.end();  
                        }
                    })
                }
            })
        }
        
    })
})
//To verify the teacher with the verification mail sent to  teacher
router.get('/teacherconfirmation/:email/:token',(req,res)=>{ 
   TeacherToken.findOne({ token: req.params.token }, function (err, token) {  
         if (!token){                                   //checks verification token is active or expired.   
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<div>Your verification link may have expired.</div><br /><br /><a href="${HOST}/resend-teacherverificationmail/${req.params.email}">Click Here to resend verification mail</a>: `);
            res.end();      
           }
                else{                                 //checks whether teacher already have account or not                     
           Teacher.findOne({ _id: token._Id, email: req.params.email }, function (err, teacher) {
                if (!teacher){
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<div>We were unable to find a teacher for this verification. Please SignUp!</div><br /><br /><a href="${EMAIL}/teachersignup">Click Here to sign in</a>: `);
                    res.end();  }
                else if (teacher.isVerified){         //checks is the teacher account is already verified  
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<div>Your account has been already verified .Please Login </div><br /><br /><a href="${EMAIL}/teachersignin">Click Here to sign in</a>: `);
                    res.end();                 }
                else{                                 //verifys the teacher account.
                    teacher.isVerified = true;
                    teacher.save(function (err) { 
                        if(err){
                            return res.status(500).send({msg: err.message});
                        }
                        else{
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.write(`<div>Your account has been successfully verified</div><br /><br /><a href="${EMAIL}/teachersignin">Click Here to sign in</a>: `);
                            res.end();                          }
                    })
                }
            })
        }
        
    })
})
//Resends verification mail to student
router.get('/resend-studentverificationmail/:email',(req,res)=>{
    Student.findOne({ email: req.params.email }).then((student)=> {
        if (!student){                          
            return  res.status(401).send('We were unable to find a user with that email. Make sure your Email is correct!')
        }
        else if (student.isVerified){
            return  res.status(200).send('This account has been already verified. Please log in.');
    
        } 
        else{
            var token = new StudentToken({ _Id: student._id, token: crypto.randomBytes(16).toString('hex') })
            token.save(function (err) {
                if (err) {
                  return res.status(500).send({err:err.message});
                }
                    var mailOptions = { 
                        from: 'noreplybuddy1@gmail.com', 
                        to: student.email,
                         subject: 'Study Prism :Account Verification Link', 
                         text: 'Hello '+ student.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/studentconfirmation\/' + student.email + '\/' + token.token + '\n\nThank You!\n'
                      
            };
                    transport.sendMail(mailOptions, function (err) {
                        return  res.status(200).send('Verification email is sent to '+student.email);
    
                })
            })
        }
    }).catch(err=>{
        console.log(err)
    })
})
//Resends verification mail to teacher
router.get('/resend-teacherverificationmail/:email',(req,res)=>{
    Teacher.findOne({ email: req.params.email }).then((teacher)=> {
        if (!teacher){
            return  res.status(401).send('We were unable to find a user with that email. Make sure your Email is correct!')
        }
        else if (teacher.isVerified){
            return  res.status(200).send('This account has been already verified. Please log in.');
    
        } 
        else{
            var token = new TeacherToken({ _Id: teacher._id, token: crypto.randomBytes(16).toString('hex') })
            token.save(function (err) {
                if (err) {
                  return res.status(500).send({err:err.message});
                }
                    var mailOptions = { 
                        from: 'noreplybuddy1@gmail.com', 
                        to: teacher.email,
                         subject: 'Study Prism :Account Verification Link', 
                         text: 'Hello '+ teacher.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/teacherconfirmation\/' + teacher.email + '\/' + token.token + '\n\nThank You!\n'
                      
            };
                    transport.sendMail(mailOptions, function (err) {
                        return  res.status(200).send('Verification email is sent to '+teacher.email);
    
                })
            })
        }
    }).catch(err=>{
        console.log(err)
    })
})
//To get password reset mail to student
router.post('/reset-studentpassword',(req,res)=>{
    if(!req.body.email)
    return res.status(422).json({error:"Enter the registered email"});
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        Student.findOne({email:req.body.email})
        .then(student=>{
            if(!student){
                return res.status(422).json({error:"Student doesnot exist with that email"})
            }
            student.resetToken = token
            student.expireToken = Date.now() + 3600000
            student.save().then((result)=>{
                transport.sendMail({
                    to:student.email,
                    from:"noreplybuddy1@gmail.com",
                    subject:"Password reset of Study Prism app",
                    html:
                    `<h5>click in this <a href="${EMAIL}/resetstudentpassword/${token}">link</a> to reset password</h5>
                    `
                })
                res.status(200).json({message:"check your email"})
            })

        })
    })
})
//To create new password by a student
router.post('/studentnewpassword',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    //Finds a student with the reset token sent in the password reset email 
    Student.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(student=>{
        if(!student){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           student.password = hashedpassword               //Replaces old password with new encrypted password
           student.resetToken = undefined
           student.expireToken = undefined
           student.save().then((savedstudent)=>{
               res.json({message:"Password updated successfully.Please Sign In!"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})
//To get password reset mail to teacher
router.post('/reset-teacherpassword',(req,res)=>{
    if(!req.body.email)
    return res.status(422).json({error:"Enter the registered email"});
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        Teacher.findOne({email:req.body.email})
        .then(teacher=>{
            if(!teacher){
                return res.status(422).json({error:"Teacher doesnot exist with that email"})
            }
            teacher.resetToken = token
            teacher.expireToken = Date.now() + 3600000
            teacher.save().then((result)=>{
                transport.sendMail({
                    to:teacher.email,
                    from:"noreplybuddy1@gmail.com",
                    subject:"Password reset of Study Prism app",
                    html:
                    `<h5>click in this <a href="${EMAIL}/resetteacherpassword/${token}">link</a> to reset password</h5>
                    `
                })
                res.status(200).json({message:"check your email"})
            })

        })
    })
})
//To create new password by a teacher
router.post('/teachernewpassword',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
      //Finds a teacher with the reset token sent in the password reset email 
    Teacher.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(teacher=>{
        if(!teacher){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           teacher.password = hashedpassword               //Replaces old password with new encrypted password
           teacher.resetToken = undefined
           teacher.expireToken = undefined
           teacher.save().then((savedteacher)=>{
               res.json({message:"Password updated successfully.Please Sign In!"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})
//To edit student profile
router.put('/editstudentprofile',studentAuthenticate,(req,res)=>{
    //Finds student with the given id.
    Student.findById(req.body.id).then(student=>{
        //Replaces old details with new entered details
        student.semester=req.body.semester;
        student.branchName=req.body.branchName;
        student.collegeId=req.body.collegeId;
        student.save().then((savedstudent)=>{
            res.json({savedstudent});
        })
    })
    .catch(err=>{
        console.log(err);
    })
})
//To view student profile by teacher
router.get('/viewstudentprofile/:studentid',teacherAuthenticate,(req,res)=>{
    Student.findOne({_id:req.params.studentid})
    .select("-password")
    .then(student=>{
    return  res.status(200).json({student})

    }).catch(err=>{
        return res.status(404).json({error:"Student not found"})
    })
})
module.exports=router;
