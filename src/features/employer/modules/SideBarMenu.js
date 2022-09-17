import { Link } from "react-router-dom";
import { Circle } from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import {
  faAddressBook,
  faCalendarAlt,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./SideBarMenu.module.scss";
import AuthContext from "../../../store/authcontext";
const SideBarMenu = () => {
  const authCtx = useContext(AuthContext);

  const changeCurrentCompany = (e, company) => {
    e.preventDefault();

    authCtx.changeCurrentCompany(company);
  };

  return (
    <ul
      className="
  nav nav-pills
  flex-column
  mb-sm-auto mb-0 px-5 py-5
   align-items-sm-start
   sidebarmenu
"
      id="menu"
    >
      <li className="nav-item" key="menu-companies">
        <Link
          to="/employer/companies"
          className={`nav-link align-middle px-0 ${styles.link__special}`}
        >
          <FontAwesomeIcon icon={faLocationArrow} />
          <span className="ms-1  d-sm-inline">My Companies</span>
        </Link>
      </li>

      <li className="nav-item text-center" key="menu-company-selected">
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="true"
          >
            {authCtx.currentCompany.name}
          </button>
          <ul
            className={`dropdown-menu ${styles["sidebarmenu__companylist"]}`}
            aria-labelledby="dropdownMenuButton1"
          >
            {authCtx.data.companies.map((element, index) => {
              return (
                <li key={element._id}>
                  <Link
                    onClick={(e) => changeCurrentCompany(e, element)}
                    className="dropdown-item"
                  >
                    {element.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </li>

      <li className="nav-item" key="menu-employees">
        <Link to="#submenu2" className="nav-link px-0 align-middle">
          <FontAwesomeIcon icon={faAddressBook} />
          <span className="ms-1  d-sm-inline">Employees</span>
        </Link>
        <ul
          className="nav flex-column ms-4"
          id="submenu2"
          data-bs-parent="#menu"
        >
          <li className="w-100" key="menu-employees-la">
            <Link to="/employer/employee/" className="nav-link px-0">
              <Circle /> List All
            </Link>
          </li>

          <li key="menu-employees-er">
            <Link to="/employer/employee/role/" className="nav-link px-0">
              <Circle /> Employee Roles
            </Link>
          </li>
        </ul>
      </li>
      <li className="nav-item" key="menu-schedule">
        <Link
          to="#submenu3"
          data-bs-toggle=""
          className="nav-link px-0 align-middle"
        >
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span className="ms-1  d-sm-inline">Scheduling</span>
        </Link>
        <ul
          className=" nav flex-column ms-4"
          id="submenu3"
          data-bs-parent="#menu"
        >
          <li className="w-100" key="menu-schedule-s">
            <Link to="/employer/schedule/" className="nav-link px-0">
              <Circle /> Schedules
            </Link>
          </li>

          <li key="menu-schedule-bp">
            <Link to="/employer/blueprint/" className="nav-link px-0">
              <Circle /> Blueprint
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default SideBarMenu;

/* <li className="nav-item">
        <Link
          to="#submenu2"
          data-bs-toggle="collapse"
          className="nav-link px-0 align-middle"
        >
          <FontAwesomeIcon icon={faAddressBook} />
          <span className="ms-1  d-sm-inline">Employees</span>
        </Link>
        <ul
          className="collapse nav flex-column ms-4"
          id="submenu2"
          data-bs-parent="#menu"
        ></ul> */

/*
      <li className="nav-item" key="menu-manager-log">
        <Link to="#" className="nav-link px-0 align-middle">
          <FontAwesomeIcon icon={faSignInAlt} />
          <span className="ms-1  d-sm-inline">Manager Log</span>
        </Link>
      </li>
      <li className="nav-item" key="menu-reports">
        <Link to="#" className="nav-link px-0 align-middle">
          <FontAwesomeIcon icon={faFolder} />
          <span className="ms-1  d-sm-inline">Reports</span>
        </Link>
      </li>
      <li className="nav-item" key="menu-pl">
        <Link to="#" className="nav-link px-0 align-middle">
          <FontAwesomeIcon icon={faPrint} />
          <span className="ms-1  d-sm-inline">Print Lineup</span>
        </Link>
      </li> */

/* 
          <li className="nav-item" key="menu-inbox">
        <Link to="/" className="nav-link px-0 align-middle">
          <FontAwesomeIcon icon={faFolder} />
          <span className="ms-1  d-sm-inline">Inbox</span>
        </Link>
        <ul
          className="show nav flex-column ms-4"
          id="submenu1"
          data-bs-parent="#menu"
        >
          <li className="w-100" key="menu-inbox-sent">
            <Link to="/" className="nav-link px-0">
              <Circle /> Sent
            </Link>
          </li>
          <li key="menu-inbox-trash">
            <Link to="/" className="nav-link px-0">
              <Circle /> Trash
            </Link>
          </li>
        </ul>
      </li>
      */
/*    <li className="nav-item" key="menu-dashboard">
        <Link to="/" className="nav-link align-middle px-0">
          <FontAwesomeIcon icon={faTachometerAlt} />
          <span className="ms-1  d-sm-inline">Dashboard</span>
        </Link>
      </li>
      */
/* <li className="nav-item" key="menu-account">
        <Link className={`nav-link align-middle px-0 ${styles.link__special}`}>
          <FontAwesomeIcon icon={faUserCircle} />
          <span className="ms-1  d-sm-inline">My Account</span>
        </Link>
      </li>
      */
