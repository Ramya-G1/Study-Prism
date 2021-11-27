import React,{useState} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import M from "materialize-css";
import '../App.css'
const   TeacherNewpassword=()=>{
    const [password,setPassword]=useState("");
    const {token}=useParams();
    const navigate=useNavigate();
    const mouseoverPass=() =>{
		var obj = document.getElementById('Password');
		obj.type = "text";
	  }
	  const mouseoutPass=(obj)=> {
		var obj = document.getElementById('Password');
		obj.type = "password";
	  }
    const Postdata=()=>{
        fetch("/teachernewpassword",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.message)
            {
              M.toast({html:data.message,classes:"blue"});
              navigate('/teachersignin');
            }
            else{
              M.toast({html:data.error,classes:"red"}); 
            }
        }).catch(err=>{
            console.log(err)
        })
        }
    return(
     <div className="card" style={{minWidth:"150px",width:"30%",margin:"50px auto"}}>
        <div className="card-title" style={{paddingLeft:"10px"}}>Reset password</div>
           <div className="card-content">
               <div className="form-input input-field">
				   <input id="Password" type="password" 
					placeholder="New password"
					value={password}
					onChange={e=>setPassword(e.target.value)}
					/>
                    <i className="material-icons" style={{paddingTop:"15px"}} onMouseOver={()=>mouseoverPass()} onMouseOut={()=>mouseoutPass()} >visibility</i>
                </div>
                <button  className="btn waves-effect waves-light btn-small submitButton " style={{backgroundColor:"royalblue"}} onClick={()=>Postdata()}>Submit
				</button>
          </div>
     </div>

    )
}

export default TeacherNewpassword