import React,{useEffect,useState,useContext} from "react";
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../App';
const StudentScreen=()=>{
    const {state,dispatch}=useContext(UserContext)
    const [upload,setUpload]=useState("");
    const navigate=useNavigate();
    useEffect(()=>{
       fetch("/getassignments",{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("studentJWT")
        },
       }).then(res=>res.json())
       .then(data=>{
         setUpload(data.assignment)
       }).catch(error=>{
           console.log(error)
       })
    },[])
    const openAssignment=(item)=>{
    navigate('/assignment',{state:item._id});
    }

return (
   <>  {upload ? 
            <div className="homepage" >
                {upload.map(item=>{
                    return ( 
                        <div  className="card homepage-card" style={{margin:"50px auto",width:"35%",minWidth:"280px"}} key={item._id}>
                            <div style={{paddingLeft:"10%"}}>
                                <h5 style={{marginLeft:"10px",paddingTop:"10px"}}>
                                <div>{item.subjectCode} Assignment</div>
                                </h5>
                                <div className="card-Content" style={{paddingLeft:"10px",paddingBottom:"10px"}}>
                                    {state && item.submissions && item.submissions.find(item=>item.postedBy===state['payload']._id) && <div style={{color:"green",fontWeight:"bold"}}>Assignment submitted</div>}
                                    <div>Deadline : {(new Date(Date.parse(item.deadline)).toUTCString()).split(" GMT")[0]}</div>
                                </div>
                            </div>
                            <button  className="btn waves-effect waves-light btn-small submitButton" onClick={()=>openAssignment(item)}  style={{backgroundColor:"royalblue",marginBottom:"20px"}}>Open Assignment
                           </button>
                        </div>    
                    )
                })}
            </div>
        :
           <h3>loading...!</h3>}
    </>
    
);
}
export default StudentScreen;