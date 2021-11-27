import React,{useContext,useRef,useEffect} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import "../App.css"
import M from 'materialize-css'
import { UserContext } from '../App';
const Navbar=()=>{
  const sideNav = useRef(null);
  const navigate=useNavigate();
  const {state,dispatch}=useContext(UserContext);
  useEffect(()=>{
    M.Sidenav.init(sideNav.current, {draggable: true})
  },[])
  const deleted=()=>{
    localStorage.clear();
    dispatch({type:"CLEAR"});
    navigate('/');
  }
  const renderlist=()=>{
    if(state && state["type"]==="Student"){
      return[
          <li key="1" >< Link to="/studentprofile" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Profile</Link></li>,
          <li key="2" >< Link to="/studentscreen" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Student Screen</Link></li>,
          <li key="3" onClick={()=>{deleted()
          M.Sidenav.getInstance(sideNav.current).close()}}><a href="#" style={{color:"white"}}>Logout</a></li>
          ]
    }
    else if(state && state["type"]==="Teacher"){
       return[
        <li key="4" >< Link to="/teacherprofile" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Profile</Link></li>,
        <li key="5" >< Link to="/teacherscreen" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Faculty Screen</Link></li>,
        <li key="6" >< Link to="/createassignment" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Create Assignment</Link></li>,
        <li key="7" onClick={()=>{deleted()
        M.Sidenav.getInstance(sideNav.current).close()}}><a href="#" style={{color:"white"}}>Logout</a></li>
       ]
    }else{
       return[
        <li key="8" >< Link to="/studentsignin" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Student</Link></li>,  
        <li key="9" >< Link to="/teachersignin" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Faculty</Link></li>
       ]
    }
  }
return(
<div>
  <nav>
      <div className="nav-wrapper">
          <a href="/" className="brand-logo " >
            <i className="material-icons" style={{width:"20px",marginLeft:"10px",marginRight:"10px"}}>import_contactsstudy</i> 
            Study Prism
          </a>
          <Link to ={""} className="sidenav-trigger" data-target="slide-out">
              <i className="material-icons">menu</i>
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {   renderlist() }
           </ul>
      </div>
  </nav>
    <ul className="sidenav" id="slide-out" ref={sideNav}>
        <li><i style={{cursor:"pointer", float:"right", margin: "10px" ,color:"white"}} className="material-icons sidenav-close">close</i></li>
        {renderlist()}
    </ul>
</div>
)
}
 export default Navbar;