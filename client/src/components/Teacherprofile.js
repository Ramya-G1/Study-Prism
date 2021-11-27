import React ,{useContext}from 'react';
import {UserContext} from '../App'
const TeacherProfile=()=>{
    const {state,dispatch}=useContext(UserContext);
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
      <div class="col s4">College Name </div>
      <div class="col s1" >:</div>
      <div class="col s4">{state['payload'].collegeName}</div>
    </div>
    </div>
    </div>}
    </div>
)
}
export default TeacherProfile;