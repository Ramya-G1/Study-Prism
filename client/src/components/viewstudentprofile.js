import React,{useEffect,useState} from "react";
import {useParams} from 'react-router-dom'
const ViewStudentProfile=()=>{
    const [profileDetails,setProfileDetails]=useState();
    const {studentid} = useParams();
    useEffect(()=>{
        fetch(`/viewstudentprofile/${studentid}`,{
         headers:{
             "Authorization":"Bearer "+localStorage.getItem("teacherJWT")
         },
        }).then(res=>res.json())
        .then(data=>{
            setProfileDetails(data.student);
        }).catch(error=>{
            console.log(error);
        })
     },[])
    return (
      
        <>
        {profileDetails? 
         
         <div style={{border:"1px solid black",borderRadius:"5px", margin:"30px auto",width:"30%",minWidth:"260px"}}>
         <i class="material-icons large" style={{margin:"10px auto",paddingLeft:"35%"}}>account_circle</i>
         <div style={{marginLeft:"40px",fontSize:"16px"}}>
         <div class="row">
            <div class="col s4" >Name </div>
            <div class="col s1" >:</div>
            <div class="col s4">{profileDetails.name}</div>
          </div>
          <div class="row">
            <div class="col s4">college Id </div>
            <div class="col s1" >:</div>
            <div class="col s4">{profileDetails.collegeId}</div>
          </div>
          <div class="row">
            <div class="col s4">Semester </div>
            <div class="col s1" >:</div>
            <div class="col s4">{profileDetails.semester}</div>
          </div>
          <div class="row">
            <div class="col s4">College Name </div>
            <div class="col s1" >:</div>
            <div class="col s4">{profileDetails.collegeName}</div>
          </div>
          <div class="row">
            <div class="col s4">Branch Name </div>
            <div class="col s1" >:</div>
            <div class="col s4">{profileDetails.branchName}</div>
          </div>
          </div>
          </div>
        :
        <h2>loading....!</h2>}
        
        </>
    )
}
export default ViewStudentProfile;