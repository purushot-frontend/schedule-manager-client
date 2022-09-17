import React from "react";
import Footer from "./Footer";
import styled from "styled-components";
import TopNavigation from "./TopNavigation";
function GeneralLayout(props) {
  return (
    <React.Fragment>
      <TopNavigation />
      <main>
        <div className={`container-fluid sched-container`}>
          <div className={`row ${props.row ? props.row : ""} `}>
            {props.children}
          </div>
        </div>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default GeneralLayout;
//sched-nowrap
