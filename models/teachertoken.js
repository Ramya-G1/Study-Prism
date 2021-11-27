const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const teachertokenSchema = new mongoose.Schema({
    _Id: 
    { type:ObjectId,  required: true,  ref: 'Teacher' },
    token:  { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires:86400000 } }
})
mongoose.model("TeacherToken",teachertokenSchema)
