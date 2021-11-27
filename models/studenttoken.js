const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const studenttokenSchema = new mongoose.Schema({
    _Id: 
    { type:ObjectId,  required: true,  ref: 'Student' },
    token:  { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires:20 } }
})
mongoose.model("StudentToken",studenttokenSchema)