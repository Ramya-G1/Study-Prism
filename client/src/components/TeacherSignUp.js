import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import M from "materialize-css";
import '../App.css'
const collegeNames=['NIT Allahabad','NIT Bhopal','NIT Calicut','NIT Hamirpur','NIT Jaipur','NIT Jalandhar','NIT Jamshedpur','NIT Kurukshetra','NIT Nagpur',
'NIT Rourkela','NIT Silchar','NIT Surathkal','NIT Warangal','NIT Durgapur','NIT Srinagar','NIT Surat','NIT Trichy','NIT Patna','NIT Raipur','NIT Agartala','NIT Arunachal Pradesh','NIT Delhi','NIT Goa','NIT Manipur','NIT Meghalaya','NIT Mizoram','NIT Nagaland','NIT Puducherry','NIT Sikkim','NIT Uttarakhand','NIT Andhra Pradesh']

const TeacherSignUp=()=>{
    const [email,setEmail]=useState("");
	const [name,setName]=useState("");
	const [password,setPassword]=useState("");
	const [collegename,setCollegeName]=useState("");
  const navigate=useNavigate();
  const mouseoverPass=() =>{
    var obj = document.getElementById('myPassword');
    obj.type = "text";
    }
    const mouseoutPass=(obj)=> {
    var obj = document.getElementById('myPassword');
    obj.type = "password";
    }
    const submit=()=>{
        if(!collegename)
        {
          M.toast({html:"Fill all the fields",classes:"red"});
        }
        else{
        fetch("/teacherSignUp",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
          body:JSON.stringify({
              password,
              email,
              name,
              collegeName:collegeNames[collegename]
          })
        }).then(res=>res.json())
        .then(data=>{
          if(data.error){
            M.toast({html:data.error,classes:"red"});
          }
          else{
            M.toast({html:data.message,classes:"blue"});
            navigate('/teachersignin');
          }
        }).catch(error=>{
          console.log(error);
        })
      }
    }
    return(
  <div className="row">
    <div className="col xl6 l6 hide-on-small-only  teacher-image-container"></div>
    <div className="col xl6 l6 m6 s10 studyPrism-form-container">					
      <div className="col xl6  l6  m6  s10 studyPrism-form">
               <div>
                  <h3 >Sign Up</h3>
                </div>
                <div className="form-input">
                  <input type="text" name="" placeholder="Email"   value={email}
                    onChange={e=>setEmail(e.target.value)}/>
                </div>
                <div className="form-input">
                    <input type="email" name="" placeholder="Name"   value={name}
                    onChange={e=>setName(e.target.value)}/>
                </div>
                <div className="form-input">
                  <select className="browser-default select-input" value={collegename} onChange={(e)=>setCollegeName(e.target.value)}>
                      <option value="none"> College Name</option>
                      {collegeNames.map((item,id)=>{
                        return(
                        <option value={id}>{item}</option>		
                          )})}
                    </select>
                  </div>
                  <div className="form-input">
                    <input  id="myPassword" type="password" name="" placeholder="Password"   value={password}
                        onChange={e=>setPassword(e.target.value)}/>
                    <i className="material-icons" style={{paddingTop:"15px"}} onMouseOver={()=>mouseoverPass()} onMouseOut={()=>mouseoutPass()} >visibility</i>
                  </div>
                <button  className="btn waves-effect waves-light btn-small submitButton" onClick={()=>submit()} >SignUp
                </button>
                <div className="existingTeacher">Already have an account?
                  <a href="/teachersignin">Sign In</a>
                </div>  
        </div>
      </div>    
  </div>
    )
}
export default TeacherSignUp;