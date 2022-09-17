import React, { useState, useReducer, useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import styles from "./Index.module.scss";
import Card from "./../components/ui/Card";
import Button from "./../components/Button";
import Input from "./../components/Input";
//import AuthContext from "./../store/authcontext";
import backendURL from "../constants/config";
const httpMessage = { message: "", active: false, type: "" };

function httpMessageReducer(state, action) {
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

const ForgotPassword = (props) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [httpMessageState, dispatchLogin] = useReducer(
    httpMessageReducer,
    httpMessage
  );

  const inputEmailRef = useRef();

  const LoginHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);
    dispatchLogin({ type: "reset" });
    const email = inputEmailRef.current.getValue();

    fetch(backendURL + "/api/v1/user/forgotPassword", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
      headers: {
        "Content-type": "application/json",
      },
    }).then(async (response) => {
      const result = await response.json();

      if (result.status === "success") {
        dispatchLogin({
          type: "success",
          message: "Please check your email to reset password.",
        });

        setTimeout(() => {
          history.replace("/");
        }, 3000);
      } else {
        setIsLoading(false);
        dispatchLogin({ type: "fail", message: result.message });
        setTimeout(() => {
          dispatchLogin({ type: "reset" });
        }, 3000);
      }
    });
  };
  return (
    <React.Fragment>
      <div
        className={`col col-md-4 offset-md-2 col-12 my-5  py-5 px-5 ${styles.border_right}`}
      >
        <Card className="py-3 px-4">
          <form className="text-center" onSubmit={LoginHandler}>
            <h3>Forgot Password</h3>
            <div className="form-group py-2">
              <label></label>

              <Input
                ref={inputEmailRef}
                type="email"
                className="form-control"
                placeholder="Email"
              />
            </div>

            <div className="form-group form-check text-end">
              <Link to="/">Login</Link>
            </div>
            <div className="form-group form-check text-center px-0">
              {httpMessageState.active && (
                <p className={httpMessageState.class}>
                  {httpMessageState.message}
                </p>
              )}
            </div>
            <Button
              text={!isLoading ? `Reset Password` : `Loading...`}
              className="btn-warning"
              type="submit"
            />
          </form>
        </Card>
      </div>
      <div className="col col-md-4 offset-md-2 col-12 my-5  py-5 px-5"></div>
    </React.Fragment>
  );
};

export default ForgotPassword;
