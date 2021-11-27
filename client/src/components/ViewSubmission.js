import React, {useState,useEffect,useContext}from 'react';
import { Link} from 'react-router-dom';
import { useLocation } from 'react-router';
import { UserContext } from '../App';
import '../App.css'
const ViewSubmission=()=>{
    const location=useLocation();
    const assignmentdata=location.state;
    const[marks,setMarks]=useState(0);
    const [comment,setComment]=useState("");
    const {state,dispatch}=useContext(UserContext);
    const [data,setData]=useState("");
    const [openmarks,setOpenmarks]=useState("");
    const [openfeedback,setOpenfeedback]=useState("");
    const [feedback,setFeedback]=useState("");
    useEffect(()=>{
        fetch(`/assignments/${assignmentdata}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("teacherJWT")
            },
           }).then(res=>res.json())
           .then(data=>{
             setData(data.post);
           }).catch(error=>{
               console.log(error)
           })
    },[])
    const handleinputmarks=async(id)=>{
       await setOpenmarks(id);
    }
    const handleinputfeedback=async(id)=>{
        await setOpenfeedback(id);
    }
     const submitmarks=async(id)=>{
        fetch("/addmarks",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("teacherJWT")
            },
            body:JSON.stringify({
                submissionId:id,
                marks:marks,
                assignmentId:assignmentdata
            })
        }).then(res=>res.json())
        .then(data=>{
            setOpenmarks("")
            setData(data)
        }).catch(err=>{
            console.log(err)
        })
        await setMarks(0);
     }
     const editmarks=async(id)=>{
         await setOpenmarks(id)
     }
    const makeComment=async(comment,id)=>{
        fetch("/postcommentbyteacher",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("teacherJWT")
            },
            body:JSON.stringify({
                postId:id,
                text:comment
            })
        }).then(res=>res.json())
        .then(result=>{
         setData(result)
        }).catch(error=>{
            console.log(error)
        })
        await setComment("");
       }
       const deletecomment=(postid,commentid)=>{
        fetch(`/deletecomments/${postid}/${commentid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("teacherJWT")
            }
        }).then(res=>res.json())
        .then(result=>{
           setData(result)
        }).catch(error=>{
            console.log(error)
        })
       }
     const submitfeedback=async(id)=>{
        fetch("/addfeedback",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("teacherJWT")
            },
            body:JSON.stringify({
                submissionId:id,
                feedback:feedback,
                assignmentId:assignmentdata
            })
        }).then(res=>res.json())
        .then(data=>{
            setOpenfeedback("")
            setData(data)
        }).catch(err=>{
            console.log(err)
        })
        await  setFeedback("");
     }
     const editfeedback=async(id)=>{
         await setOpenfeedback(id)
     }
return(
    <div className="card" style={{width:"95%",height:"100vh",margin:"20px auto"}}>
        <div className="card-content row " style={{display:"flex"}}>
            <div className="card col s12 m6 l6 " style={{width:"60%",height:"90vh",overflow:"scroll"}}>
                <div className="card-content">
                    <table>
                        <thead>
                            <tr>
                                <th>Registration Id</th>
                                <th>Submission</th>
                                <th style={{paddingLeft:"40px"}}>Time</th>
                                <th>Marks</th>
                                <th>Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                                {data && data.submissions && (data.submissions).map(item=>{
                                return(

                                        <tr>
                                            <td><Link to={"/viewstudentprofile/"+item.postedBy._id}>{item.postedBy.collegeId}</Link></td>
                                            <td><a href={item.url} target="_blank" rel="noopener noreferrer">View</a></td>
                                            <td>{(new Date(item.submitted_at).toString()).split("GMT")[0]}</td>
                                            <td>{ openmarks!=item._id &&  (item.marks==0 ?<button onClick={()=>handleinputmarks(item._id)} style={{backgroundColor:"royalblue"}}>add marks</button>:<><div>{item.marks}</div><i class="material-icons" onClick={()=>editmarks(item._id)}>edit</i></>)}
                                            {
                                                openmarks==item._id && <div className="input-field" ><input type="text" style={{width:"50%"}} placeholder="Add marks" value={marks} onChange={e=>setMarks(e.target.value)}/> <button style={{backgroundColor:"royalblue"}}onClick={()=>submitmarks(item._id)}>submit</button></div>
                                            }
                                            </td>
                                            <td>{openfeedback!=item._id && (item.text=="" ?<button style={{backgroundColor:"royalblue"}} onClick={()=>handleinputfeedback(item._id)}>add feedback</button>:<><div>{item.text}</div><i class="material-icons" onClick={()=>editfeedback(item._id)}>edit</i></>)}
                                            {
                                                openfeedback==item._id  && <><input type="text" style={{width:"50%"}} placeholder="Add feedback" value={feedback} onChange={e=>setFeedback(e.target.value)}/> <button style={{backgroundColor:"royalblue"}} onClick={()=>submitfeedback(item._id)}>submit</button></>
                                            }
                                            </td>
                                        
                                        </tr>

                                )
                                })}
                        </tbody>
                    </table>
                </div>
                {data.submissions && (data.submissions).length==0 && <div style={{justifyContent:"center"}}>No Submissions yet</div>}
            </div>
            <div className="card col s12 m6 l6 " style={{width:"40%",float:"right",height:"90vh",marginLeft:"15px",overflow:"scroll"}}>
                    <div className="card-content">
                        <h1 className="submissionTitle card-title">{data.subjectCode} Assignment  </h1>
                        <a href={data.assignmentUrl} target="_blank" rel="noopener noreferrer">
                            <button style={{backgroundColor:"royalblue",marginTop:"20px",marginBottom:"20px"}} className="btn waves-effect waves-light btn-small submitButton " >View Assignment</button>
                        </a>
                        <div style={{borderTop:"1px solid black"}}>
                            {
                            data.comments &&   data.comments.map(result=>{
                                return(
                                <>
                                {result.postedBy===null
                                ?
                                <h6 key={result._id}><span style={{fontWeight:"500"}}>{data.postedBy.name}:</span> {result.text}  {state && data.postedBy._id == state['payload']._id 
                                && <i className="material-icons" style={{float:"right" ,height:"20px"}} 
                                    onClick={()=>deletecomment(data._id ,result._id)}
                                >delete</i>}</h6>
                                : 
                                <h6 key={result._id}><span style={{fontWeight:"500"}}>{result.postedBy.name}:</span> {result.text}  {state && result.postedBy._id == state['payload']._id 
                                && <i className="material-icons" style={{float:"right" ,height:"20px"}} 
                                onClick={()=>deletecomment(data._id ,result._id)}
                                >delete</i>}
                                </h6>
                                }
                                </>)
                                })
                            }
                            <form  autocomplete="off" onSubmit={(e)=>{ e.preventDefault()}}>
                                <div style={{display:"flex"}}>
                                    <input id ="wrap" type="text" placeholder="add a comment" value={comment}  onChange={e=>setComment(e.target.value)} /> 
                                    <i className="material-icons" style={{float:"right",paddingTop:"15px",marginRight:"10px"}}
                                    onClick={(e)=>{makeComment(comment,data._id); setComment(" ") }} >send</i>
                                </div>
                            </form>
                        </div>
                    </div>
            </div>    
        </div>
    </div>
)
}
export default ViewSubmission;