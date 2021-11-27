const express=require('express');
const cors=require('cors');
const app=express();
const mongoose=require('mongoose');
const {MONGOURI}=require('./config/keys')

const PORT=process.env.PORT||5000;
mongoose.connect(MONGOURI,{ useNewUrlParser: true,useUnifiedTopology: true});
mongoose.connection.on('connected',()=>{
    console.log("connected")
});
mongoose.connection.on('error',()=>{
    console.log("error")
});
require('./models/assignment')
require('./models/student')
require('./models/teacher')
require('./models/studenttoken');
require('./models/teachertoken');
app.use(cors());
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/assignment'));
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
app.listen(PORT,(req,res)=>{
    console.log("server is listening");
});