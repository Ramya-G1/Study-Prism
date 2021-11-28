import React,{useEffect,useState} from "react";
import {useNavigate} from 'react-router-dom'
import M from "materialize-css";
const TeacherScreen=()=>{
    const [upload,setUpload]=useState([]);
    const [editdeadline,setEditDeadline]=useState("");
    const [deadline,setDeadline]=useState('');
    const [time,setTime]=useState('');
    const navigate=useNavigate();
    const openSubmission=(data)=>{
  navigate('/submission',{state:data._id})
    }
    useEffect(()=>{
       fetch("/myassignment",{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("teacherJWT")
        },
       }).then(res=>res.json())
       .then(data=>{
          setUpload(data.post)
       }).catch(error=>{
           console.log(error)
       })
    },[])
    const deleteassignment=(id)=>{
        fetch(`/deleteassignment/${id}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("teacherJWT")
            }
        }).then(res=>res.json())
        .then(result=>{
            const newData = upload.filter(item=>{
                return item._id !== result._id
            })
            setUpload(newData)
        })
    }
    const submitdeadline=(id)=>{
        if(time && deadline){
        fetch("/editassignmentdeadline",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("teacherJWT")
            },
          body:JSON.stringify({
              id,
              deadline:deadline,
              time:time
          })
        }).then(res=>res.json())
        .then(result=>{
            const data=result.savedassignment;
           const newData=upload.map(item=>{
                if(item._id==data._id){
                    return data;
                }else{
                    return item;
                }
            }) 
              setUpload(newData);
        setEditDeadline("");
        }).catch(error=>{
          console.log(error);
        })
    }
    else
    {
        M.toast({html:"Set deadline",classes:"red"});
    }
    }
    const editmarks=(id)=>{
        setEditDeadline(id);
    }
return (

    <div className="homepage" style={{maxWidth:"500px",margin:"50px auto"}}>
        {upload ?
        <>{upload.length ? <>{upload.map(item=>{
            return ( 
                  <div  className="card homepage-card" key={item._id}>
                        <i className="material-icons" style={{float:"right" ,height:"20px"}} onClick={()=>deleteassignment(item._id)} >delete
                        </i>
                        <h5 style={{marginLeft:"10px",paddingTop:"10px"}}><div>{item.subjectCode} Assignment</div>
                        </h5>
                        <div className="card-Content" style={{paddingLeft:"10px",paddingBottom:"10px"}}>
                        <h6  style={{paddingTop:"10px",paddingBottom:"10px"}}>Assigned to {item.branchName} branch ,{item.semester}th semester
                        </h6>
                        {<div style={{ display: "flex",marginBottom:"15x"}}><i class="material-icons" onClick={()=>editmarks(item._id)}>edit</i><div>Deadline : {(new Date(Date.parse(item.deadline)).toUTCString()).split(" GMT")[0]}</div></div>}
                        {editdeadline==item._id && <div style={{ display: "flex",marginBottom:"20px",paddingRight:"10px"}}>
                         <div style={{paddingTop:"10px",paddingRight:"10px"}}></div>
                            <input type="date" 
                            value={deadline}
                            onChange={e=>setDeadline(e.target.value)}
                            />
                            <input type="time"  
                            value={time}
                            onChange={e=>setTime(e.target.value)}
                            />
                            <button style={{backgroundColor:"royalblue"}}onClick={()=>submitdeadline(item._id)}>Edit</button>
                        </div>}
                        <a style={{paddingTop:"10px",paddingBottom:"10px",marginBottom:"10px"}} href={item.assignmentUrl} target="_blank" rel="noopener noreferrer">View assignment</a>
                        <button  className="btn waves-effect waves-light btn-small submitButton " style={{backgroundColor:"royalblue"}} onClick={()=>openSubmission(item)} >view Submissions
                        </button>
                        </div>
                  </div>
           )
        })}</> :<h3>No assignments</h3>}</>:<h2>Loading....</h2>}
    </div>
    
);
}
export default TeacherScreen;