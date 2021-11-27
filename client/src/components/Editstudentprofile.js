import React,{useState,useContext,useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import {UserContext} from '../App'
const brancharray={'computer Science':"0",'Electronics And Communication':"1",'Electrical And Electronics':"2",'Mechincal Engineering':"3",'Civil Engineering':"4",'Metallurgical Engineering':"5",'ChemicalEngineering':"6"};

const branchNames=['Computer Science','Electronics And Communication','Electrical And Electronics','Mechincal Engineering','Civil Engineering','Metallurgical Engineering','ChemicalEngineering'];
const Editstudentprofile=()=>{
    const navigate=useNavigate();
    const {state,dispatch}=useContext(UserContext);
    const [collegeId,setCollegeId]=useState("");
    const [branch,setBranch]=useState("");
    const [semester,setSemester]=useState("");
    useEffect(() => {
        if(state)
        {setBranch(brancharray[state['payload'].branchName]);
        setSemester(state['payload'].semester);
        setCollegeId(state['payload'].collegeId);}
    }, [state])
    const edit=()=>{
        fetch("/editstudentprofile",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("studentJWT")
            },
          body:JSON.stringify({
              id:state['payload']._id,
              collegeId,
              semester,
              branchName:branchNames[branch]
          })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{collegeId:data.savedstudent.collegeId,branchName:data.savedstudent.branchName,semester:data.savedstudent.semester}})
             localStorage.setItem("student",JSON.stringify(data.savedstudent))
          navigate('/studentprofile');
        }).catch(error=>{
          console.log(error);
        })
    }
return(
    <div style={{border:"1px solid black",width:"35%",margin:"50px auto"}}>
       <div style={{width:"60%",margin:"30px auto"}}>
           <h4 className="editdetails">Edit details</h4>
            <div className="input-field ">
               <input type="text" placeholder="CollegeId" value={collegeId}
				onChange={e=>setCollegeId(e.target.value)}/>
            </div>
            <div className="input-field ">
				<select className="browser-default select-input " value={branch} onChange={(e)=>setBranch(e.target.value)}>
                <option value="none"> Branch Name</option>
				{branchNames.map((item,id)=>{
				return(
				<option value={id}>{item}</option>		
				)})}
				</select>
			</div>
            <div >
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
            <button  className="btn waves-effect waves-light btn-small submitButton " style={{backgroundColor:"royalblue",marginBottom:"10px",marginTop:"20px"}} onClick={()=>edit()}>Save
            </button>
        </div>
    </div>
)
}
export default Editstudentprofile;