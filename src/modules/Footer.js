import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
const Footer = () => {
  return (
    <FooterWrapper className="sched-footer  py-3 px-5  text-small">
      <ul className="list-inline text-end fw-bold">
        <li key="1" className="list-inline-item">
          <Link className="anchor--inverse" to="/">
            Home
          </Link>
        </li>
        <li key="2" className="list-inline-item">
          <FontAwesomeIcon icon={faCircle} />{" "}
          <Link className="anchor--inverse" to="/register/">
            Register
          </Link>
        </li>
      
     
      </ul>
      <p className="mb-1">© Schedule Manager</p>
      <ul className="list-inline text-end">
        <li key="6" className="list-inline-item">
          <Link to="/">Terms of Use</Link>
        </li>
        <li key="7" className="list-inline-item">
          <FontAwesomeIcon icon={faCircle} /> <Link to="/">Privacy Policy</Link>
        </li>
      </ul>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  margin-top: 100px;


 

  @media (max-width: 614px) {

  }
`;

export default Footer;
