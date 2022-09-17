import React, {
  useState,
  useReducer,
  useRef,
  useContext,
  Suspense,
} from "react";
import { useHistory, Link } from "react-router-dom";
import styles from "./Index.module.scss";
import Card from "./../components/ui/Card";
import Spinner from "./../components/ui/Spinner";
import Button from "./../components/Button";
import Input from "./../components/Input";
import AuthContext from "./../store/authcontext";
import backendURL from "../constants/config";
//import Slider from "../modules/Slider";
import { Placeholder } from "react-bootstrap";
import "../../node_modules/react-slideshow-image/dist/styles.css";
const Slider = React.lazy(() => import("../modules/Slider"));
const loginMessage = { message: "", active: false, type: "" };
function loginMessageReducer(state, action) {
  switch (action.type) {
    case "success":
      return { message: action.message, active: true, class: "text-success" };
    case "fail":
      return { message: action.message, active: true, class: "text-danger" };
    case "reset":
      return { active: false, message: "", type: "" };
    default:
      throw new Error();
  }
}

const Index = (props) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessageState, dispatchLogin] = useReducer(
    loginMessageReducer,
    loginMessage
  );

  const inputEmailRef = useRef();
  const inputPassRef = useRef();
  const authCtx = useContext(AuthContext);

  const LoginHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);
    dispatchLogin({ type: "reset" });
    const email = inputEmailRef.current.getValue();
    const password = inputPassRef.current.getValue();
if(email && password) { 
    fetch(backendURL + "/api/v1/user/signin", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    }).then(async (response) => {
      const result = await response.json();

      if (result.status === "success") {
        dispatchLogin({ type: "success", message: "Login Success!" });

        authCtx.addLogin(result.token, result.data.user);

        setTimeout(() => {
          history.replace("/employer/companies");
        }, 1000);
      } else {
        setIsLoading(false);
        dispatchLogin({ type: "fail", message: result.message });
        setTimeout(() => {
          dispatchLogin({ type: "reset" });
        }, 3000);
      }
    
    
    });

  } else {
    setIsLoading(false);
    dispatchLogin({ type: "fail", message: "Enter Email & Password To Continue..." });
    setTimeout(() => {
      dispatchLogin({ type: "reset" });
    }, 3000);
  }
  };
  return (
    <React.Fragment>
      <div
        className={`col col-lg-4  offset-lg-2 col-12 my-5  py-5 px-5 ${styles.border_right}`}
      >
        <Card className="py-3 px-4">
          <form className="text-center" onSubmit={LoginHandler}>
            <h3>Sign-In</h3>
            <div className="form-group py-2">
              <label></label>

              <Input
                ref={inputEmailRef}
                type="email"
                className="form-control"
                placeholder="Email"
              />
              <small id="emailHelp" className="form-text text-muted"></small>
            </div>
            <div className="form-group py-2">
              <label></label>

              <Input
                ref={inputPassRef}
                type="password"
                className="form-control"
                placeholder="Password"
              />
            </div>
          
            <div className="form-group form-check text-center px-0">
              {loginMessageState.active && (
                <p className={loginMessageState.class}>
                  {loginMessageState.message}
                </p>
              )}
            </div>

            {isLoading ? (
              <Spinner />
            ) : (
              <Button text="Submit" className="btn-warning" type="submit" />
            )}
          </form>
        </Card>
      </div>
      <div className="col col-lg-6  col-12 my-5  py-5 px-5">
        <h1>Notice</h1>
        <p>
      I developed this prototype version in React/Node with <a href="https://schedcheck.com">schedcheck.com</a> permission to showcase my skills 😀. Want to use some real scheduling? please check out their site!. - Purushothaman J
        </p>
        <p>Features :
          <br/>
          <ul>
            <li>Email Verification</li>
            <li>Stripe Payment Gatway</li>
            <li>Ability to manage multiple companies</li>
            <li>Smart blueprint system - Automatically hires employees based on requirements.</li>
            <li>Smart conflict system - Blueprint wont hire the same employee for new schedule if his/her is already busy with another schedule.</li>
          </ul>
          <p>Usuage Guide :
            <br/>
            <ol>
              <li>Register</li>
              <li>Verify</li>
              <li>Login</li>
              <li>Create / Manage Employee  Roles</li>
              <li>Create / Manage Employees</li>
              <li>Create / Manage Blueprints</li>
              <li>Create / Manage Schedules</li>
            </ol>
          </p>

        </p>
<p>Why not <Link to="/register">Register</Link> to get started!</p>
        <div className="slide-container mt-4"></div>
      </div>
    </React.Fragment>
  );
};

export default Index;
/*
 <Suspense
            fallback={
              <Placeholder
                as="p"
                animation="wave"
                style={{ minHeight: "350px" }}
                xs={12}
                bg="dark"
              />
            }
          >
            <Slider />
          </Suspense>
          */
