import React ,{useContext,useEffect}from 'react';
import {UserContext} from '../App'
import {useNavigate} from 'react-router-dom'
const StudentProfile=()=>{
    const {state,dispatch}=useContext(UserContext);
    const navigate=useNavigate();
    const edit=()=>{
      navigate('/editstudentprofile')
    }
return(
    <div>
   {state &&  state['payload'] && <div style={{border:"1px solid black",borderRadius:"5px", margin:"30px auto",width:"30%",minWidth:"260px"}}>
   <i class="material-icons large" style={{margin:"10px auto",paddingLeft:"35%"}}>account_circle</i>
   <div style={{marginLeft:"40px",fontSize:"16px"}}>
   <div class="row">
      <div class="col s4" >Name </div>
      <div class="col s1" >:</div>
      <div class="col s4">{state['payload'].name}</div>
    </div>
    <div class="row">
      <div class="col s4">college Id </div>
      <div class="col s1" >:</div>
      <div class="col s4">{state['payload'].collegeId}</div>
    </div>
    <div class="row">
      <div class="col s4">Semester </div>
      <div class="col s1" >:</div>
      <div class="col s4">{state['payload'].semester}</div>
    </div>
    <div class="row">
      <div class="col s4">College Name </div>
      <div class="col s1" >:</div>
      <div class="col s4">{state['payload'].collegeName}</div>
    </div>
    <div class="row">
      <div class="col s4">Branch Name </div>
      <div class="col s1" >:</div>
      <div class="col s4">{state['payload'].branchName}</div>
    </div>
    </div>
    <button  className="btn waves-effect waves-light btn-small submitButton" style={{backgroundColor:"royalblue",marginBottom:"10px"}} onClick={()=>edit()}>Edit Details
       </button>
    </div>}
    </div>
)
}
export default StudentProfile;