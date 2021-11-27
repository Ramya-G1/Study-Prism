import React,{useState,useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import M from "materialize-css";
import '../App.css'
import { UserContext } from '../App';
const TeacherSignIn=()=>{
    const [password, setPassword]= useState("")
    const [email, setEmail]= useState("")
    const navigate=useNavigate();
    const {state,dispatch}=useContext(UserContext)
    const mouseoverPass=() =>{
        var obj = document.getElementById('myPassword');
        obj.type = "text";
      }
      const mouseoutPass=(obj)=> {
        var obj = document.getElementById('myPassword');
        obj.type = "password";
      }
   const Signin=()=>{
    fetch("/teacherSignIn",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
      body:JSON.stringify({
          password,
          email
      })
    }).then(res=>res.json())
    .then(data=>{
        if(data.error){
            M.toast({html:data.error,classes:"red"});
        }
        else{
            localStorage.setItem("teacherJWT",data.token);
            localStorage.setItem("teacher",JSON.stringify(data.teacher));
            dispatch({type:"TEACHER",payload:data.teacher});
            navigate('/teacherscreen');
        }
    }).catch(error=>{
      console.log(error);
    })
}
    return(
        <div className="row">
             <div className="col xl6 l6 m5 hide-on-small-only  teacher-image-container"></div>

              <div className="col xl6 l6 m6 s10 studyPrism-form-container">					
                 <div className="col xl6  l6  m6  s10 studyPrism-form">
                       <div>
                         <h3 >Sign In</h3>
                        </div>
                         <div className="form-input row">
                            <i className="material-icons col s2" style={{paddingTop:"15px"}}>email</i>
                             <input type="text" name="" placeholder="Email" 	value={email}
						               	 onChange={e=>setEmail(e.target.value)}/>
                          </div>
                          <div className="form-input row">
                              <i className="material-icons col s2" style={{paddingTop:"15px"}}>lock</i>
                              <input  id="myPassword" type="password" name="" placeholder="Password"value={password}
							                onChange={e=>setPassword(e.target.value)}/>
                              <i className="material-icons" style={{paddingTop:"15px"}} onMouseOver={()=>mouseoverPass()} onMouseOut={()=>mouseoutPass()} >visibility</i>
                          </div>
                          <button  className="btn waves-effect waves-light btn-small  submitButton"  onClick={()=>Signin()} >Signin
                          </button>
                          <div className="existingTeacher">Don't have an account?
						                 <a href="/teachersignup">Sign Up</a>
                          </div>
                          <div className="existingTeacher">Forgot Password? 
                            <a href="/resetteacherpassword">Click here</a>
                          </div>

                   </div>
              </div>
        </div>
    )
}
export default TeacherSignIn;