import React,{useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { storage } from "../firebase/index";
import M from "materialize-css";
import crypto from 'crypto'
const branchNames=['Computer Science','Electronics And Communication','Electrical And Electronics','Mechincal Engineering','Civil Engineering','Metallurgical Engineering','ChemicalEngineering']

const CreateAssignment=()=>{
    const navigate=useNavigate();
    const [subject,setSubject]=useState('');
    const [time,setTime]=useState('');
    const [semester,setSemester]=useState('');
    const [branch,setBranch]=useState('');
    const [file,setFile]=useState('')
    const [deadline,setDeadline]=useState('');
    const [url, setUrl] = useState("");
    const [filename,setFilename]=useState("");
      useEffect(()=>{
        if(url && filename){
        fetch("/createAssignment",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("teacherJWT")
            },
            body:JSON.stringify({
                url:url,
                subjectCode:subject,
                semester:semester,
                branchName:branchNames[branch],
                deadline:deadline,
                fileName:filename,
                time:time
            })
        }).then(res=>res.json())
        .then(data=>{
          if(data.error){
            M.toast({html:data.error,classes:"red"});
          }
          else{
          navigate("/teacherscreen");
          }
        }).catch(err=>{
            console.log(err)
        })
    }
    },[url])
    const handleUpload = async() => {
      const name=crypto.randomBytes(16).toString('hex')+Date.now();
      setFilename(name);
       const uploadTask = storage.ref(`files/${name}`).put(file);
       uploadTask.on(
         "state_changed",
         snapshot => {},
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
     };
     
   const create=()=>{
     if(!file  || !subject || !branch || !deadline || !time)  {
      M.toast({html:"Fill all the details",classes:"red"});
     }
     else{
    handleUpload();
     }
   }
    return(
        <div className="card input-field"  style={{margin:"40px auto",maxWidth:"450px",padding:"20px",textAlign:"center"}} >
            <h4>Create Assignment</h4>
            <input type="text" placeholder="subject Name" 
             value={subject}
             onChange={e=>setSubject(e.target.value)}
            />
           <div style={{ display: "flex"}}>
              <div style={{paddingTop:"10px",paddingRight:"10px"}}>Deadline:</div>
              <input type="date" 
              value={deadline}
              onChange={e=>setDeadline(e.target.value)}
              />
              <input type="time"  
              value={time}
              onChange={e=>setTime(e.target.value)}
              />
           </div>
           <div className="input-field ">
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
						<div className="input-field ">
							<select className="browser-default select-input " value={branch} onChange={(e)=>setBranch(e.target.value)}>
							<option value=""> Branch Name</option>
							{branchNames.map((item,id)=>{
							return(
						   <option value={id}>{item}</option>		
					   )})}
							</select>
						</div>
            <div className="file-field input-field">
                <div className="btn " style={{backgroundColor:"royalblue"}}>
                  <span>Upload File</span>
                    <input type="file" onChange={e=>setFile(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button  className="btn waves-effect waves-light btn-small submitButton " style={{backgroundColor:"royalblue"}} onClick={()=>create()}>Create
             </button>
      </div>
    )
}
export default CreateAssignment;

