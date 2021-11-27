import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import M from "materialize-css";
import '../App.css'
const ResetStudentpassword=()=>{
    const [email,setEmail]=useState("");
    const navigate=useNavigate();
    const Postdata=()=>{
        fetch("/reset-studentpassword",{
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
                navigate('/studentsignin');
            }
         }).catch(err=>{
             console.log(err)
         })
        }
    return(
    <div className="card" style={{minWidth:"150px",width:"30%",margin:"50px auto"}}>
        <div className="card-title" style={{paddingLeft:"10px"}}>Reset password</div>
             <div className="card-content">
                <div>
                   <div className="input-field">
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
    </div>

    )
}

export default ResetStudentpassword