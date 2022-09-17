import React, { Fragment } from "react";
import SideBar from "./SideBar";
import styled from "styled-components";
const EmployerLayout = (props) => {
  return (
    <Fragment>
      <SideBar />
      <Wrapper className="row">
        <div className="col py-3">{props.children}</div>
      </Wrapper>
    </Fragment>
  );
};

const Wrapper = styled.div`
  margin-left: 320px;
  width: calc(99vw - 320px);
  @media (max-width: 1000px) {
    margin-left: 50px;
    width: 95vw;
  }
`;

export default EmployerLayout;
