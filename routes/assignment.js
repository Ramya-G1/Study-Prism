const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const studentAuthenticate=require('../middleware/studentAuthenticate');
const teacherAuthenticate = require('../middleware/teacherAuthenticate');
const Assignment=mongoose.model("Assignment");
const Student=mongoose.model("Student");
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const {SENDGRID_API,EMAIL}=require('../config/keys');
const transport=nodemailer.createTransport(sendgridTransport({
      auth:{
          api_key:SENDGRID_API
      }
}))
//To edit assignment deadline by teacher
router.put('/editassignmentdeadline',teacherAuthenticate,(req,res)=>{ 
    //Finds assignment with given id.
    Assignment.findById(req.body.id).populate("submissions.postedBy","_id collegeId").then(assignment=>{
        assignment.deadline=req.body.deadline+" "+req.body.time;     //Replaces deadline
        assignment.save().then((savedassignment)=>{
            //Finds all the students to whom assignment is assigned for.
            Student.find({semester:assignment.semester,collegeName:assignment.collegeName,branchName:assignment.branchName})
            .then((student)=>{
                //Sends email notification that deadline is changed to all those students
                  student.forEach((student)=>{
                    var mailOptions = { from: 'noreplybuddy1@gmail.com', to: student.email, subject: 'Study Prism : Assignment Deadline is changed', 
                    html:
                    `<h3>${assignment.subjectCode} assignment  assigned by ${req.teacher.name}  deadline is changed to ${(new Date(assignment.deadline).toString()).split(":00 GMT")[0]}    <a href="${EMAIL}/studentscreen">open Assignment</a></h3>
                    ` 
                  }
                    transport.sendMail(mailOptions, function (err) {
                       
                })
                  })
            })
            .catch(error=>{
            console.log(error)
        });
           return res.status(200).json({savedassignment});
        })
    })
    .catch(err=>{
        console.log(err);
    })
})
//To create assignment by teacher
router.post("/createassignment",teacherAuthenticate,(req,res)=>{
    const {subjectCode,semester,branchName,deadline,fileName,url,time}=req.body;
     if(!subjectCode || !semester || !branchName || !url || !deadline || !time){
         return res.status(422).json({error:"Fill all the details"});
     }
     const assignment=new Assignment({
      assignmentUrl:url,
       subjectCode:subjectCode,
       collegeName:req.teacher.collegeName,
       semester:semester,
       branchName:branchName,
       deadline:deadline+" "+time,
       postedBy:req.teacher._id,
       fileName:fileName
    })
    //saves assignment in database
    assignment.save().then(assignment=>{
        //finds all the students to whom assignment is assigned for.
        Student.find({semester:assignment.semester,collegeName:assignment.collegeName,branchName:assignment.branchName})
        .then((student)=>{
            //sends email notification that assignment is created to all those students
              student.forEach((student)=>{
                var mailOptions = { from: 'noreplybuddy1@gmail.com', to: student.email, subject: 'Study Prism : New Assignment ', 
                html:
                `<h3>${assignment.subjectCode} assignment is assigned by ${req.teacher.name} and deadline is ${(new Date(assignment.deadline).toString()).split(":00 GMT")[0]}    <a href="${EMAIL}/studentscreen">open Assignment</a></h3>
                ` 
              }
                transport.sendMail(mailOptions, function (err) {
                   
            })
              })
        })
        .catch(error=>{
        console.log(error)
    });
       return res.status(200).send({assignment});
    }).catch(err=>{
    console.log(err)
     })
});
//Student retrieves all the assigned assignments to him .
router.get('/getassignments',studentAuthenticate,(req,res)=>{
    Assignment.find({semester:req.student.semester,collegeName:req.student.collegeName,branchName:req.student.branchName})
    .populate("comments.postedBy","_id name")
    .then((assignment)=>{
        return res.status(200).json({assignment});
    })
    .catch(error=>{
    console.log(error)
});
});
//Teacher retrieve the assignment with given id 
router.get('/assignments/:id',teacherAuthenticate,(req,res)=>{
    Assignment.findById(req.params.id)
    .populate("submissions.postedBy","_id collegeId")
    .populate("comments.postedBy","_id name ")
    .populate("postedBy","_id name")
    .then(post=>{
        return res.status(200).json({post})
    })  
    .catch(error=>{
    console.log(error)
});
})
//Student retrieve the assignment with given id
router.get('/assignment/:id',studentAuthenticate,(req,res)=>{
    Assignment.findById(req.params.id)
    .populate("comments.postedBy","_id name ")
    .populate("postedBy","_id name")
    .then(post=>{
        return res.status(200).json({post})
    })  
    .catch(error=>{
    console.log(error)
});
})
//Teacher retrieves all the assignments assigned by him
router.get('/myassignment',teacherAuthenticate,(req,res)=>{
    Assignment.find({postedBy:req.teacher._id})
    .populate("submissions.postedBy","_id collegeId")
    .then(post=>{
        return res.status(200).json({post})
    })
    .catch(error=>{
    console.log(error)
});
})
//submits the answer sheet to particular assignment by Student 
router.put('/submitassignment',studentAuthenticate,(req,res)=>{
    const submission={
        url:req.body.url,
        filename:req.body.filename,
        postedBy:req.student._id,
        submitted_at:Date.now(),
        marks:0,
        text:""
    }
    //pushs students submission details into assignment submissions
    Assignment.findByIdAndUpdate(req.body.assignmentId,{
        $push:{submissions:submission}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
           return res.status(200).json(result)
        }
    })
});
//add marks to the submissions of students by Teacher 
router.put('/addmarks',teacherAuthenticate,async(req,res)=>{
    //Updates the marks of submission record of a student with given submission id 
 await Assignment.updateOne({'submissions._id': req.body.submissionId}, {'$set': {
        'submissions.$.marks': req.body.marks
    }}).then(assignment=>{
        console.log(assignment)
    })
 await  Assignment.findById(req.body.assignmentId)
 .populate("submissions.postedBy","_id collegeId")
 .populate("comments.postedBy","_id name")
 .populate("postedBy","_id name")
 . then(assignment=>{
      return res.status(200).json(assignment);
  })
  .catch(err=>{
      console.log(err);
  })

});
//add feedback to the submissions of students by Teacher 
router.put('/addfeedback',teacherAuthenticate,async(req,res)=>{
     //Updates the feedbacl of submission record of a student with given submission id 
    await Assignment.updateOne({'submissions._id': req.body.submissionId}, {'$set': {
           'submissions.$.text': req.body.feedback
       }}).then(assignment=>{
           
       })
    await  Assignment.findById(req.body.assignmentId)
    .populate("submissions.postedBy","_id collegeId")
   .populate("comments.postedBy","_id name")
   .populate("postedBy","_id name")
    . then(assignment=>{
         return res.status(200).json(assignment);
     })
     .catch(err=>{
         console.log(err);
     })
   
   });
//deletes his submitted answer sheet by student
router.delete('/deletesubmission/:id/:answersheet_id',studentAuthenticate,(req,res)=>{
    const submission = { postedBy: req.params.answersheet_id };
    //find assignment with given id and pulls the submitted answer sheet of student
    Assignment.findByIdAndUpdate(
    req.params.id,
   {
     $pull: {submissions: submission},
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err || !result){
            return res.status(422).json({error:err})
        }else{
            console.log(result);
            return res.status(200).json(result)
        }
    })
})
//add comment by student 
router.put('/postcommentbystudent',studentAuthenticate,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.student._id
    }
    Assignment.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
   .populate("comments.postedBy","_id name")
   .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            console.log(result)
           return  res.status(200).json(result)
        }
    })
})
//add comment by teacher
router.put('/postcommentbyteacher',teacherAuthenticate,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.teacher._id
    }
    Assignment.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("submissions.postedBy","_id collegeId")
   .populate("comments.postedBy","_id name")
   .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            console.log(result)
           return  res.status(200).json(result)
        }
    })
})
//delete comment by student
router.delete('/deletecomment/:id/:comment_id',studentAuthenticate,(req,res)=>{
    const comment = { _id: req.params.comment_id };
    Assignment.findByIdAndUpdate(
    req.params.id,
   {
     $pull: { comments: comment },
    },{
        new:true
    })
   .populate("comments.postedBy","_id name")
   .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err || !result){
            return res.status(422).json({error:err})
        }else{
           return  res.status(200).json(result)
        }
    })
})
//delete comment by teacher
router.delete('/deletecomments/:id/:comment_id',teacherAuthenticate,(req,res)=>{
    const comment = { _id: req.params.comment_id };
    Assignment.findByIdAndUpdate(
    req.params.id,
   {
     $pull: { comments: comment },
    },{
        new:true
    })
    .populate("submissions.postedBy","_id collegeId")
   .populate("comments.postedBy","_id name")
   .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err || !result){
            return res.status(422).json({error:err})
        }else{
           return  res.status(200).json(result)
        }
    })
})
//deletes assignment by teacher
router.delete('/deleteassignment/:id',teacherAuthenticate,(req,res)=>{
        Assignment.findOne({_id:req.params.id})
        .exec((err,assignment)=>{
            if(err || !assignment){
                return res.status(422).json({error:err})
            }
             assignment.remove()
                  .then(result=>{
                      res.json(result)
                  }).catch(err=>{
                      console.log(err)
                  })
        })
})
module.exports=router;