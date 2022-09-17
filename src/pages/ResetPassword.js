import React, { useState, useReducer, useRef } from "react";
import {
  useHistory,
  Link,
  /* useParams,*/ useLocation,
} from "react-router-dom";
import styles from "./Index.module.scss";
import Card from "./../components/ui/Card";
import Button from "./../components/Button";
import Input from "./../components/Input";
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

const ResetPassword = (props) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [httpMessageState, dispatchHttpMessage] = useReducer(
    httpMessageReducer,
    httpMessage
  );

  let urlParams = new URLSearchParams(useLocation().search);
  const passwordResetToken = urlParams.get("passwordResetToken");

  const inputPassRef = useRef();
  const inputConfirmPassRef = useRef();
  const LoginHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    dispatchHttpMessage({ type: "reset" });

    const password = inputPassRef.current.getValue();
    const confirmPassword = inputConfirmPassRef.current.getValue();
    const response = await fetch(
      backendURL + "/api/v1/user/resetPassword/" + passwordResetToken + "",
      {
        method: "PATCH",
        body: JSON.stringify({
          password,
          confirmPassword,
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      dispatchHttpMessage({
        type: "success",
        message: data.message,
      });

      setTimeout(() => {
        history.replace("/");
      }, 3000);
    } else {
      setIsLoading(false);
      dispatchHttpMessage({ type: "fail", message: data.message });
      setTimeout(() => {
        dispatchHttpMessage({ type: "reset" });
      }, 3000);
    }
  };
  return (
    <React.Fragment>
      <div
        className={`col col-md-4 offset-md-2 col-12 my-5  py-5 px-5 ${styles.border_right}`}
      >
        <Card className="py-3 px-4">
          <form className="text-center" onSubmit={LoginHandler}>
            <h3>Change Password</h3>
            <div className="form-group py-2">
              <label></label>

              <Input
                ref={inputPassRef}
                type="password"
                className="form-control"
                placeholder="Password"
              />
            </div>
            <div className="form-group py-2">
              <label></label>

              <Input
                ref={inputConfirmPassRef}
                type="password"
                className="form-control"
                placeholder="Confirm Password"
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
              text={!isLoading ? `Submit` : `Loading...`}
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

export default ResetPassword;
