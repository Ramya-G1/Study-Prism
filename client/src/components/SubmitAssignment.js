import React,{useState,useEffect,useContext} from 'react';
import crypto from 'crypto'
import { useLocation } from 'react-router';
import M from "materialize-css";
import { storage } from "../firebase/index";
import { UserContext } from '../App';
const SubmitAssignment=()=>{
    const location=useLocation();
    const assignmentdata=location.state;
    const {state,dispatch}=useContext(UserContext);
    const [progress, setProgress] = useState(0);
    const [filename,setFilename]=useState("");
    const [file,setFile]=useState("");
    const [url,setUrl]=useState("");
    const [comment,setComment]=useState("");
    const [data,setData]=useState("");
    const handleUpload=()=>{
        const name=crypto.randomBytes(16).toString('hex')+Date.now();
        setFilename(name);
       const uploadTask = storage.ref(`files/${name}`).put(file);
        uploadTask.on(
          "state_changed",
          snapshot => {const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);},
          error => {
            console.log(error);
          },
          () => {
            storage
              .ref("files")
              .child(name)
              .getDownloadURL()
              .then(url => {
                setUrl(url);
              });
          }
        );
    }
    useEffect(()=>{
        if(url && filename){
        fetch("/submitassignment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("studentJWT")
            },
            body:JSON.stringify({
                url:url,
                filename:filename,
                time:Date.now(),
                assignmentId:data._id
            })
        }).then(res=>res.json())
        .then(data=>{
         setData(data);
         setProgress(0);
        }).catch(err=>{
            console.log(err)
        })
    }
    },[url])
    useEffect(()=>{
        fetch(`/assignment/${assignmentdata}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("studentJWT")
            },
           }).then(res=>res.json())
           .then(data=>{
             setData(data.post);
           }).catch(error=>{
               console.log(error)
           })
    },[])
   const create=()=>{
       if(!file)
       {
        M.toast({html:"Upload answer sheet",classes:"red"});
       }
       else{
        handleUpload();  
       }
    
   }
   const makeComment=(comment,id)=>{
    fetch("/postcommentbystudent",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("studentJWT")
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
   }
   const deletecomment=(postid,commentid)=>{
    fetch(`/deletecomment/${postid}/${commentid}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("studentJWT")
        }
    }).then(res=>res.json())
    .then(result=>{
       setData(result)
    }).catch(error=>{
        console.log(error)
    })
   }
    const Delete=()=>{
        fetch(`/deletesubmission/${data._id}/${state['payload']._id}`,{
            method:"delete",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("studentJWT")
            }
        }).then(res=>res.json())
        .then(data=>{
         setData(data);
        }).catch(err=>{
            console.log(err)
        })
    }
return(
    <div>
        <div className="card submission-card submissionCard " style={{margin:"30px auto"}}>
          <div className="card-content">
                    <div className="row">
                        <div className="col m6 s9">
                            <h1 className="submissionTitle card-title">{data.subjectCode} Assignment </h1>
                            <div>Deadline :{(new Date(Date.parse(data.deadline)).toUTCString()).split(" GMT")[0]}</div>
                            <div>
                                <a href={data.assignmentUrl} target="_blank" rel="noopener noreferrer">
                                    <button  className="btn waves-effect waves-light btn-small submitButton " style={{backgroundColor:"royalblue",marginLeft:"auto",marginTop:"20px"}} >View Assignment
                                    </button>
                                </a>
                            </div>
                        </div>
                        <div className="card col m5 s9 submissionDetails">
                            {data && state && data.submissions && data.submissions.find(item=>item.postedBy===state['payload']._id) 
                            ? 
                                <div>
                                    <span class="card-title " style={{paddingLeft:"10px",paddingTop:"10px",borderBottom:"1px solid black"}}>Your work</span>
                                    <div> Assignment submitted</div>
                                    { data.deadline && ((new Date(data.deadline)).getTime()-19800000)<Date.now() 
                                        ? <div>{data.submissions.map(submission=>{
                                            return(
                                                <>
                                                {state && submission.postedBy===state['payload']._id && <><div>Submission time : {(new Date(submission.submitted_at).toString()).split("GMT")[0]}</div><div>Deadline Completed</div><div>Marks : {submission.marks}</div>
                                                <div>Feedback: {submission.text}</div></>}
                                                </>
                                                )
                                                })}
                                          </div>
                                        :
                                           <button  className="btn waves-effect waves-light btn-small submitButton " style={{backgroundColor:"royalblue",marginBottom:"10px"}} onClick={()=>Delete()}>Delete
                                            </button>
                                    }         
                                </div>
                            :
                                <div>
                                    {data.deadline &&  ((new Date(data.deadline)).getTime()-19800000)<Date.now() 
                                    ?
                                    <div>
                                        <span class="card-title " style={{paddingLeft:"10px",paddingTop:"10px",borderBottom:"1px solid black"}}>Your work</span>
                                        <div> Not submitted assignment <br/> Deadline Completed</div>
                                        <div>Marks: 0</div>
                                    </div>
                                    : 
                                    <div>
                                        <span class="card-title " style={{paddingLeft:"10px",paddingTop:"10px",borderBottom:"1px solid black"}}>Your Work</span>
                                        <div className="file-field input-field">
                                            <div>Drop file from here</div>
                                            <i class="small material-icons">add_circle
                                            <input type="file" onChange={e=>setFile(e.target.files[0])}/>
                                            </i>
                                            <progress value={progress} max="100" />
                                            <div className="file-path-wrapper">
                                            <input className="file-path validate" type="text" />
                                            </div>
                                            <button  className="btn waves-effect waves-light btn-small submitButton " style={{backgroundColor:"royalblue",marginBottom:"10px"}} onClick={()=>create()}>Submit
                                            </button>
                                        </div>
                                     </div>
                                    }
                                </div>
                             }
                        </div>
                   </div>
                <div style={{borderTop:"1px solid black"}}>
                    {
                    data.comments &&   data.comments.map(result=>{
                        return(
                            <div>
                                {result.postedBy===null
                                ?
                                    <h6 key={result._id}><span style={{fontWeight:"500"}}>{data.postedBy.name}:</span> {result.text}  {state  && data.postedBy._id == state['payload']._id 
                                    && <i className="material-icons" style={{float:"right" ,height:"20px"}} 
                                    onClick={()=>deletecomment(data._id ,result._id)}
                                    >delete</i>}
                                    </h6>
                                :  <h6 key={result._id}><span style={{fontWeight:"500"}}>{result.postedBy.name}:</span> {result.text}  {state && result.postedBy._id == state['payload']._id 
                                    && <i className="material-icons" style={{float:"right" ,height:"20px"}} 
                                    onClick={()=>deletecomment(data._id ,result._id)}
                                    >delete</i>}
                                    </h6>
                                }
                            </div>
                            )
                        })
                    }
                    <form  autocomplete="off" onSubmit={(e)=>{ e.preventDefault() }}>
                            <div style={{display:"flex"}}>
                            <div className="input-field">
                                <input id ="wrap" type="text" placeholder="add a comment" value={comment}  onChange={e=>setComment(e.target.value)} />
                            </div>
                            <i className="material-icons" style={{float:"right",paddingTop:"15px",marginRight:"10px"}}
                            onClick={(e)=>{makeComment(comment,data._id);setComment(" ") }} >send</i>
                            </div>
                            
                    </form>
               </div>
         </div>
        </div>
    </div>
 )
}
export default SubmitAssignment;