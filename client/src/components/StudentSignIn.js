import React ,{useState,useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import '../App.css'
import M from "materialize-css";
import { UserContext } from '../App';
const StudentSignIn=()=>{
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
		fetch("/studentSignIn",{
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
			  localStorage.setItem("studentJWT",data.token);
			  localStorage.setItem("student",JSON.stringify(data.student));
			  dispatch({type:"STUDENT",payload:data.student});
			  navigate('/studentscreen');
		  }
		}).catch(error=>{
		  console.log(error);
		})
	}
    return (
		<div className="row">
	    	<div className="col xl6 l6 m5 hide-on-small-only  student-image-container"></div>
				<div className="col xl6 l6 m7 s10 studyPrism-form-container">					
					<div className="col xl6  l6  m7  s10 studyPrism-form">
							<div>
							<h3 >Sign In</h3>
							</div>
					
							<div className="form-input row">
							<i className="material-icons col s2" style={{paddingTop:"15px"}}>email</i>
								<input type="text" 
								placeholder="Email"
								value={email}
								onChange={e=>setEmail(e.target.value)}
								/>
							</div>
							<div className="form-input row">
								<i className="material-icons col s2"  style={{paddingTop:"15px"}}>lock</i>
								<input  id="myPassword" type="password"
								placeholder="Password"
								value={password}
						    	onChange={e=>setPassword(e.target.value)}/>
							    <i className="material-icons" style={{paddingTop:"15px"}} onMouseOver={()=>mouseoverPass()} onMouseOut={()=>mouseoutPass()} >visibility</i>
							</div>
							<button  className="btn waves-effect waves-light btn-small  submitButton"   onClick={()=>Signin()}>Signin
							</button>
							<div className="existingStudent">Don't have an account? <a href="/studentsignup">Sign Up</a></div>
							<div className="existingStudent">Forgot Password? <a href="/resetstudentpassword">Click here</a></div>
		        	</div>
		     </div>
		</div>
    );
}
export default StudentSignIn;