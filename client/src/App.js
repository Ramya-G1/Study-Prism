import React,{createContext,useReducer,useEffect,useContext} from 'react';
import {BrowserRouter,Route,Routes,useNavigate} from "react-router-dom";
import './App.css'
import StudentSignUp  from './components/StudentSignUp';
import StudentSignIn from './components/StudentSignIn';
import Navbar from './components/Navbar';
import TeacherSignIn from './components/TeacherSignIn';
import LandingPage from './components/Landingpage';
import TeacherProfile from './components/Teacherprofile';
import TeacherSignUp from './components/TeacherSignUp';
import StudentScreen  from './components/StudentScreen';
import StudentProfile from './components/Studentprofile';
import CreateAssignment from './components/CreateAssignment';
import TeacherScreen from './components/TeacherScreen';
import SubmitAssignment from './components/SubmitAssignment';
import ViewStudentProfile from './components/viewstudentprofile';
import ViewSubmission from './components/ViewSubmission';
import ResetStudentpassword from './components/resetstudentpassword';
import StudentNewpassword from './components/StudentNewpassword';
import ResetTeacherpassword from './components/resetteacherpassword';
import TeacherNewpassword from './components/TeacherNewpassword';
import Editstudentprofile from './components/Editstudentprofile';
import {reducer} from "./reducers/userreducer";
import {initialState} from "./reducers/userreducer";
export const UserContext=createContext();
const Routing=()=>{
  const navigate=useNavigate();
  const {state,dispatch}=useContext(UserContext);
  useEffect(()=>{
    const student=JSON.parse(localStorage.getItem('student'));
    const teacher=JSON.parse(localStorage.getItem('teacher'));
    if(student || teacher)
    {
      if(student)
     {
       dispatch({type:"STUDENT",payload:student});
       if(window.location.pathname.startsWith('/teacherscreen')) 
     navigate("/studentscreen");  
     }
     else {
     dispatch({type:"TEACHER",payload:teacher});
     if(window.location.pathname.startsWith('/studentscreen')) 
     navigate("/teacherscreen");  
     } 
    }
    else
    {
      if(!window.location.pathname.startsWith('/resend') && !window.location.pathname.startsWith('/reset')  && !window.location.pathname.startsWith('/studentsignin') && !window.location.pathname.startsWith('/studentsignup') && !window.location.pathname.startsWith('/teachersignin') && !window.location.pathname.startsWith('/teachersignup')) 
        navigate("/");   
    }
   
  },[])
  return(
 <Routes>
   <Route  path="/editstudentprofile"element={<Editstudentprofile/>} />
    <Route  path="/studentscreen"element={<StudentScreen/>} />
     <Route  path="/viewstudentprofile/:studentid"element={<ViewStudentProfile/>} /> 
    <Route  path="/studentprofile"element={<StudentProfile/>} />
    <Route  path="/teacherprofile"element={<TeacherProfile/>} />
    <Route  path="/submission"element={<ViewSubmission/>} />
    <Route  path="/assignment"element={<SubmitAssignment/>} />
    <Route  path="/resetstudentpassword"element={<ResetStudentpassword/>} />
    <Route exact path="/resetstudentpassword/:token" element={<StudentNewpassword/>}/>
    <Route exact path="/resetteacherpassword/:token" element={<TeacherNewpassword/>}/>
    <Route  path="/resetteacherpassword"element={<ResetTeacherpassword/>} />
    <Route  path="/createassignment"element={<CreateAssignment/>} />
    <Route  path="/teacherscreen"element={<TeacherScreen/>} /> 
    <Route  path="/"element={<LandingPage/>} /> 
    <Route  path="/teachersignin"element={<TeacherSignIn/>} /> 
    <Route  path="/studentsignin"element={<StudentSignIn />} /> 
    <Route  path="/teachersignup"element={<TeacherSignUp />} /> 
    <Route  path="/studentsignup"element={<StudentSignUp />} /> 
  </Routes>
  )
}
function App() {
const [state,dispatch]=useReducer(reducer,initialState)
 return (
   <UserContext.Provider value={{state,dispatch}}>
   <BrowserRouter>
   <Navbar/> 
   <Routing/>
   </BrowserRouter>
   </UserContext.Provider>
 );
}
export default App;