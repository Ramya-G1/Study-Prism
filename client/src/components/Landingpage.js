import React from 'react';

function LandingPage(){
    return(
		<div>
      <div className="landingPage"></div>
      <div className="landingPageBody">
          <h3 className="landingPageTitle">Assignments And Submissions</h3>
          <div className="landingPageContent">
              <div style={{ display:"flex",marginTop:"10px"}}>
                <i className="material-icons" style={{color:"steelblue",marginRight:"10px"}}>wb_incandescent</i>
                <div style={{fontSize:"medium"}}>A digital solution to assign Assignment with Submission Date </div>
              </div>
              <div style={{ display:"flex",marginTop:"10px"}}>
                <i className="material-icons" style={{color:"steelblue",marginRight:"10px"}}>notifications</i>
                <div style={{fontSize:"medium"}}>Real-time Email notification to students to know when an assignment is assigned</div>
              </div>
              <div style={{ display:"flex",marginTop:"10px"}}>
                <i className="material-icons" style={{color:"steelblue",marginRight:"10px"}}>event_available</i>
                <div style={{fontSize:"medium"}}> Student can submit answer sheet online before deadline</div>
              </div>
              <div style={{ display:"flex",marginTop:"10px"}}>
                <i className="material-icons" style={{color:"steelblue",marginRight:"10px"}}>create</i>
                <div style={{fontSize:"medium"}}> Faculty can review submission from any where and provide marks,feedback</div>
              </div>
              <div style={{ display:"flex",marginTop:"10px"}}>
                <i className="material-icons" style={{color:"steelblue",marginRight:"10px"}}>insert_comment</i>
                <div style={{fontSize:"medium"}}> Discussion for an assignment</div>
              </div>
          </div>
      </div>
   </div>


    )
};
export default LandingPage;