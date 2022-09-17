import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../store/authcontext";
import Button from "../components/Button";
const TopNavigation = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const logoutHandler = () => {
    authCtx.removeLogin();
    history.replace("/");
  };

  return (
    <header>
      <nav className="sched-navbar navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">
            <img
              src="/sched.png"
              className="img-fluid img-logo"
              alt="Logo"
              width="254"
              height="70"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li key="home" className="nav-item py-1">
                <Link className="nav-link " to="/">
                  Home
                </Link>
              </li>
              <li key="register" className="nav-item py-1">
                <Link key="register" className="nav-link" to="/register/">
                  Register
                </Link>
              </li>

              {authCtx.isLoggedIn && (
                <React.Fragment>
                  <li key="employer-companies" className="nav-item py-1">
                    <Link className="btn btn-warning" to="/employer/companies">
                      My Companies
                    </Link>
                  </li>

                  <li key="logout" className="nav-item py-1">
                    <Button
                      onClick={logoutHandler}
                      className="sched-btn-light"
                      text="Logout"
                      type="button"
                    />
                  </li>
                </React.Fragment>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default TopNavigation;
