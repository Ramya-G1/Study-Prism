import React,{useState} from 'react'
import M from "materialize-css";
import {useNavigate} from 'react-router-dom'
import '../App.css'
const ResetTeacherpassword=()=>{
    const [email,setEmail]=useState("");
    const navigate=useNavigate();
    const Postdata=()=>{
        fetch("/reset-teacherpassword",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error)
            M.toast({html:data.error,classes:"red"});
            else
            {
                M.toast({html:data.message,classes:"blue"});
                navigate('/teachersignin');
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
					<input type="text" 
					placeholder="Enter email"
					value={email}
					onChange={e=>setEmail(e.target.value)}
					/>
				</div>
                    <button  className="btn waves-effect waves-light btn-small submitButton " style={{backgroundColor:"royalblue"}} onClick={()=>Postdata()}>Submit
					</button>
           </div>
       </div>

    )
}

export default ResetTeacherpassword