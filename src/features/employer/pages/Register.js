/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useReducer, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import Spinner from "./../../../components/ui/Spinner";
import Card from "../../../components/ui/Card";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import styles from "./Register.module.css";
import Select from "../../../components/Select";
import RegisterForm from "./RegisterForm";
import timeZones from "../../../constants/timeZones";
import backendURL, {stripePublicKey} from "../../../constants/config";
const stripePromise = loadStripe(stripePublicKey);
const regObj = {
  companyName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  timeZone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function regObjReducer(state, action) {
  return { ...state, ...action.payload };
}

const Register = () => {
  const [errorMessageState, setErrorMessageState] = useState("");
  const [registerPhase, setRegisterPhase] = useState(1);
  const [regObjState, dispatchregObj] = useReducer(regObjReducer, regObj);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const companyNameRef = useRef();
  const address1Ref = useRef();
  const address2Ref = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const zipRef = useRef();
  const countryRef = useRef();
  const timeZoneRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  // const [verficiationLink, setVerificationLink] = useState(
  //   "https://schedcheck.com"
  // );

  //change registration phase/step, validate form data, store in object:regObj
  const changePhase = async (event) => {
    event.preventDefault();

    if (registerPhase === 1) {
      const companyName = companyNameRef.current.getValue();
      if (!/[a-zA-Z]/.test(companyName)) {
        setErrorMessageState("Company Name should have atleast one letter.");
        companyNameRef.current.focus();
        return;
      }

      dispatchregObj({
        type: "default",
        payload: { companyName },
      });

      setRegisterPhase(2);
    } else if (registerPhase === 2) {
      const address1 = address1Ref.current.getValue();
      const address2 = address2Ref.current.getValue();
      const city = cityRef.current.getValue();
      const state = stateRef.current.getValue();
      const zip = zipRef.current.getValue();
      const country = countryRef.current.getValue();
      if (!/[a-zA-Z0-9]/.test(address1)) {
        setErrorMessageState("Invalid form fields.");
        address1Ref.current.focus();
        return;
      }

      if (!/[a-zA-Z0-9]/.test(address2)) {
        setErrorMessageState("Invalid form fields.");
        address2Ref.current.focus();
        return;
      }

      if (!/[a-zA-Z]/.test(city)) {
        setErrorMessageState("Invalid form fields.");
        cityRef.current.focus();
        return;
      }

      if (!/[a-zA-Z]/.test(state)) {
        setErrorMessageState("Invalid form fields.");
        stateRef.current.focus();
        return;
      }

      if (!/[a-zA-Z0-9]/.test(zip)) {
        setErrorMessageState("Invalid form fields.");
        zipRef.current.focus();
        return;
      }

      if (!/[a-zA-Z]/.test(country)) {
        setErrorMessageState("Invalid form fields.");
        countryRef.current.focus();
        return;
      }
      setErrorMessageState("");
      dispatchregObj({
        type: "default",
        payload: {
          address1,
          address2,
          city,
          state,
          zip,
          country,
        },
      });
      setRegisterPhase(3);
    } else if (registerPhase === 3) {
      const timeZone = timeZoneRef.current.getValue();

      dispatchregObj({
        type: "default",
        payload: { timeZone },
      });
      setRegisterPhase(4);
    } else if (registerPhase === 4) {
      const email = emailRef.current.getValue();
      const password = passwordRef.current.getValue();
      const confirmPassword = confirmPasswordRef.current.getValue();

      if (!/\S+@\S+\.\S+/.test(email)) {
        setErrorMessageState("Invalid Email");

        emailRef.current.focus();

        return;
      }
      if (!(password.length >= 6)) {
        setErrorMessageState("Password must contain atleast six characters.");

        passwordRef.current.focus();

        return;
      }
      if (!(password === confirmPassword)) {
        setErrorMessageState("Passwords does not match each other");
        passwordRef.current.focus();
        return;
      }

      // check if email is available
      setEmailVerifying(true);
      fetch(`${backendURL}/api/v1/user/status/${email}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      }).then(async (response) => {
        setEmailVerifying(false);
        const result = await response.json();

        if (result.active) {
          setErrorMessageState("Email not available, try another.");
          emailRef.current.focus();

          return;
        }

        dispatchregObj({
          type: "default",
          payload: {
            email,
            password,
            confirmPassword,
          },
        });
        setRegisterPhase(5);
      });
    } else {
      setRegisterPhase(1);
    }
  };

  const PhaseOne = () => {
    return (
      <form className="text-center" onSubmit={changePhase}>
        <div className="form-group py-2">
          <label className="mb-3">Please enter the name of your company.</label>

          <div className="col-md-6 offset-md-3 col-12">
            <Input
              type="text"
              className="form-control text-center"
              placeholder="Company Name"
              required
              ref={companyNameRef}
            />
          </div>
          <small className="form-text text-danger">{errorMessageState}</small>
        </div>

        <Button type="submit" text="Continue" className="btn-warning mt-3" />
      </form>
    );
  };

  const PhaseTwo = () => {
    return (
      <form className="text-center" onSubmit={changePhase}>
        <div className="form-group py-2">
          <label className="mb-3">Please enter your company address.</label>
          <Input
            type="text"
            className="form-control"
            placeholder="Address Line 1"
            ref={address1Ref}
            required
          />
          <small className="form-text text-danger"></small>
        </div>
        <div className="form-group py-2">
          <Input
            type="text"
            className="form-control mb-3"
            placeholder="Address Line 2"
            ref={address2Ref}
            required
          />
          <small className="form-text text-danger"></small>
        </div>
        <div className="row py-2">
          <div className="form-group col-md-6">
            <Input
              type="text"
              className="form-control"
              placeholder="City"
              ref={cityRef}
              required
            />
            <small className="form-text text-danger"></small>
          </div>
          <div className="form-group col-md-6">
            <Input
              type="text"
              className="form-control"
              placeholder="Zip/Postcal Code"
              ref={zipRef}
              required
            />
            <small className="form-text text-danger"></small>
          </div>
        </div>

        <div className="row py-2">
          <div className="form-group col-md-6">
            <Input
              type="text"
              className="form-control"
              placeholder="State/Province"
              ref={stateRef}
              required
            />
            <small className="form-text text-danger"></small>
          </div>
          <div className="form-group col-md-6">
            <Input
              type="text"
              className="form-control"
              placeholder="Country"
              ref={countryRef}
              required
            />
          </div>
        </div>
        <small className="form-text text-danger">{errorMessageState}</small>
        <br />
        <Button type="submit" text="Continue" className="btn-warning mt-3" />
      </form>
    );
  };

  const PhaseThree = () => {
    return (
      <form className="text-center" onSubmit={changePhase}>
        <div className="form-group py-2">
          <label className="mb-3">Which Time Zone will you be using?.</label>

          <div className="col-md-4 offset-md-4 col-12">
            <Select
              data={timeZones}
              id={styles.id}
              defaultOption="--- select timezone ---"
              className="sched-select form-select text-center"
              ref={timeZoneRef}
              required
            />
          </div>
          <small className="form-text text-danger">{errorMessageState}</small>
        </div>

        <Button type="submit" text="Continue" className="btn-warning mt-3" />
      </form>
    );
  };

  const PhaseFour = () => {
    return (
      <form className="text-center" onSubmit={changePhase}>
        <div className="form-group py-2">
          <label className="mb-3">
            Enter your email address, and new password.
          </label>

          <div className="col-md-6 offset-md-3 col-12">
            <Input
              type="email"
              className="form-control "
              placeholder="Email"
              ref={emailRef}
              required
            />
          </div>
        </div>
        <div className="form-group py-2 mt-3">
          <label className="mb-3">
            Enter a password longer than 5 characters.
          </label>

          <div className="col-md-6 offset-md-3 col-12">
            <Input
              type="password"
              className="form-control "
              placeholder="Password"
              ref={passwordRef}
              required
            />
          </div>
          <small className="form-text text-danger"></small>
        </div>
        <div className="form-group py-2">
          <div className="col-md-6 offset-md-3 col-12">
            <Input
              type="password"
              className="form-control "
              placeholder="Confirm Password"
              ref={confirmPasswordRef}
              required
            />
          </div>
          <small className="form-text text-danger">{errorMessageState}</small>
        </div>
        {emailVerifying ? (
          <Spinner />
        ) : (
          <Button type="submit" text="Continue" className="btn-warning mt-3" />
        )}
      </form>
    );
  };

  const PhaseFive = () => {
    return (
      <Elements stripe={stripePromise}>
        <RegisterForm  RegisterSuccess={RegisterSuccess} regObj={regObjState} />
      </Elements>
    );
  };

  const RegisterSuccess = (url) => {
   // setVerificationLink(url);
    setRegisterPhase(6);
  };

  const FinalPhase = () => {
    return (
      <div className="text-center">
        <h1 className="cover-heading">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          Check Email
        </h1>
        <p className="lead">
          Thank you for trying out! please check your Email/Spam for verification link.
        </p>
      </div>
    );
  };

  const RegistrationStepsWizard = () => {
    return (
      <Card>
        <ul className="list-group">
          <li key="0" className="list-group-item">
            Registration Steps
          </li>

          <li
            key="1"
            className={`list-group-item list-group-item-${
              registerPhase === 1
                ? `warning`
                : `${registerPhase > 1 ? "success" : "dark"}`
            }`}
          >
            1. Company Name
          </li>

          <li
            key="2"
            className={`list-group-item list-group-item-${
              registerPhase === 2
                ? `warning`
                : `${registerPhase > 2 ? "success" : "dark"}`
            }`}
          >
            2. Company Address
          </li>

          <li
            key="3"
            className={`list-group-item list-group-item-${
              registerPhase === 3
                ? `warning`
                : `${registerPhase > 3 ? "success" : "dark"}`
            }`}
          >
            3. Company Timezone
          </li>
          <li
            key="4"
            className={`list-group-item list-group-item-${
              registerPhase === 4
                ? `warning`
                : `${registerPhase > 4 ? "success" : "dark"}`
            }`}
          >
            4. User Details
          </li>
          <li
            key="5"
            className={`list-group-item list-group-item-${
              registerPhase === 5
                ? `warning`
                : `${registerPhase > 5 ? "success" : "dark"}`
            }`}
          >
            5. Payment Details
          </li>
          <li
            key="6"
            className={`list-group-item list-group-item-${
              registerPhase === 6
                ? `warning`
                : `${registerPhase > 6 ? "success" : "dark"}`
            }`}
          >
            6. Check Email
          </li>
        </ul>
      </Card>
    );
  };

  return (
    <React.Fragment>
      <div className={`col col-md-8 offset-md-2 col-12  my-5  py-5 px-5 `}>
        <div className="col col-12">
          <div className="row">
            <div className="col col-md-9 col-12 mb-3">
              <Card className="py-2 px-2 mb-3 text-center">
                <h3>Register</h3>
              </Card>

              <Card className="py-3 px-4">
                {registerPhase === 1 ? PhaseOne() : ""}
                {registerPhase === 2 ? PhaseTwo() : ""}
                {registerPhase === 3 ? PhaseThree() : ""}
                {registerPhase === 4 ? PhaseFour() : ""}
                {registerPhase === 5 ? PhaseFive() : ""}
                {registerPhase === 6 ? FinalPhase() : ""}
              </Card>
            </div>
            <div className="col col-md-3 col-12 mb-3">
              {RegistrationStepsWizard()}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Register;
