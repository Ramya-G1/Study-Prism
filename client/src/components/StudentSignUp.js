import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom';
import M from "materialize-css";
import '../App.css'
const branchNames=['Computer Science','Electronics And Communication','Electrical And Electronics','Mechincal Engineering','Civil Engineering','Metallurgical Engineering','ChemicalEngineering']
const collegeNames=['NIT Allahabad','NIT Bhopal','NIT Calicut','NIT Hamirpur','NIT Jaipur','NIT Jalandhar','NIT Jamshedpur','NIT Kurukshetra','NIT Nagpur',
'NIT Rourkela','NIT Silchar','NIT Surathkal','NIT Warangal','NIT Durgapur','NIT Srinagar','NIT Surat','NIT Trichy','NIT Patna','NIT Raipur','NIT Agartala','NIT Arunachal Pradesh','NIT Delhi','NIT Goa','NIT Manipur','NIT Meghalaya','NIT Mizoram','NIT Nagaland','NIT Puducherry','NIT Sikkim','NIT Uttarakhand','NIT Andhra Pradesh']
const StudentSignup=()=>{
	const [email,setEmail]=useState("");
	const [name,setName]=useState("");
	const [password,setPassword]=useState("");
	const [collegeId,setCollegeId]=useState("");
	const [semester,setSemester]=useState("");
	const [branch,setBranch]=useState("");
	const [collegeName,setCollegeName]=useState("");
	const navigate=useNavigate();
	 const mouseoverPass=() =>{
		var obj = document.getElementById('Password');
		obj.type = "text";
	  }
	  const mouseoutPass=(obj)=> {
		var obj = document.getElementById('Password');
		obj.type = "password";
	  }
	const postSignUpDetails=()=>{
		if(!collegeName)
        {
          M.toast({html:"Fill all the fields",classes:"red"});
        }
		else{
			fetch("/studentSignUp",{
				method:"post",
				headers:{
					"Content-Type":"application/json"
				},
			  body:JSON.stringify({
				  password,
				  email,
				  name,
				  collegeId,
				  semester,
				  branchName:branchNames[branch],
				  collegeName:collegeNames[collegeName]
			  })
			}).then(res=>res.json())
			.then(data=>{
				if(data.error){
					M.toast({html:data.error,classes:"red"});
				}
				else{
					M.toast({html:data.message,classes:"blue"});
					navigate('/studentsignin');
				}
			 
			}).catch(error=>{
			  console.log(error);
			})
		}
		}
    return (
        <div className="row">
	     	<div className="col xl6 l6 hide-on-small-only  student-image-container"></div>
				<div className="col xl6 l6 m6 s10 studyPrism-form-container">					
					<div className="col xl6  l6  m6  s10 studyPrism-form">
							<div>
								<h3>Sign Up</h3>
							</div>
							<div className="form-input">
								<input type="text"
								placeholder="Email"
								value={email}
								onChange={e=>setEmail(e.target.value)}
								/>
							</div>
							<div className="form-input">
								<input type="text"
								placeholder="college Id"
								value={collegeId}
								onChange={e=>setCollegeId(e.target.value)}
								/>
							</div>
							<div className="form-input">
								<input type="email" 
								placeholder="Name" 
								value={name}
								onChange={e=>setName(e.target.value)}/>
							</div>
							<div className="form-input">
								<select className="browser-default select-input" value={collegeName} onChange={(e)=>setCollegeName(e.target.value)}>
										<option value="none"> College Name</option>
										{collegeNames.map((item,id)=>{
										return(
										<option value={id}>{item}</option>		
											)})}
								</select>
							</div>
							<div className="form-input">
								<select className="browser-default select-input " value={semester} onChange={(e)=>setSemester(e.target.value)}>
									<option value="none" >Semester</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
									<option value="6">6</option>
									<option value="7">7</option>
									<option value="8">8</option>
								</select>
							</div>
							<div className="form-input">
								<select className="browser-default select-input " value={branch} onChange={(e)=>setBranch(e.target.value)}>
									<option value=""> Branch Name</option>
									{branchNames.map((item,id)=>{
									return(
									<option value={id}>{item}</option>		
									)})}
								</select>
							</div>
							<div className="form-input">
								<input  id="Password" type="password"
									placeholder="Password"
									value={password}
									onChange={e=>setPassword(e.target.value)}/>
								<i className="material-icons" style={{paddingTop:"15px"}} onMouseOver={()=>mouseoverPass()} onMouseOut={()=>mouseoutPass()} >visibility</i>
							</div>
							<button  className="btn waves-effect waves-light btn-small  submitButton" onClick={()=>postSignUpDetails()} >SignUp
							</button>
							<div className="existingStudent">Already have an account?
							<a href="/studentsignin">Sign In</a>
							</div>
					</div>
			 </div>
       </div>
    )
}
export default StudentSignup;