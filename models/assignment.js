const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types;
const assignmentSchema=new mongoose.Schema({
assignmentUrl:{
    type:String,
    required:true
},
fileName:{
    type:String,
    required:true
},
subjectCode:{
    type:String,
    required:true
},
semester:{
    type:String,
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
submissions:[{
         url:String,
         filename:String,
         text:String,
         submitted_at:String,
         marks:Number,
         submitted_at:Date,
         postedBy:{
             type:ObjectId,
             ref:"Student"
         }
}],
comments:[
    {   text:String,
        postedBy:{type:ObjectId,
        ref:"Student"}
     }
],
deadline:{
    type:Date,
    required:true
},
postedBy:{
    type:ObjectId,
    ref:"Teacher"
}
});
mongoose.model("Assignment",assignmentSchema)