import React, { useState, useMemo, useRef } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import styles from "./RegisterForm.module.scss";
import backendURL from "../../../constants/config";
const useOptions = () => {
  const options = useMemo(
    () => ({
      style: {
        base: {
          color: "#000",
          backgroundColor: "#e5ae07",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#000",
          },
        },
        invalid: {
          color: "darkred",
        },
      },
    }),
    []
  );

  return options;
};

const RegisterForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  const [errorMessageState, setErrorMessageState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cardholderRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessageState("");

    if (!stripe || !elements) {
      setIsLoading(false);
      setErrorMessageState(
        "Stripe not loaded yet. wait few seconds before trying again."
      );
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // const payload = await stripe.createPaymentMethod({
    //   type: "card",
    //   card: elements.getElement(CardElement),
    // });
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      setErrorMessageState(result.error.message);
      setIsLoading(false);
      return;
    }
    const fullName = cardholderRef.current.getValue();
    if (!/[a-zA-Z]/.test(fullName)) {
      setErrorMessageState("Invalid Cardholder name.");
      cardholderRef.current.focus();
      setIsLoading(false);
      return;
    }

    // pass the token to your backend API

    fetch(backendURL + "/api/v1/user/signup", {
      method: "POST",
      body: JSON.stringify({
        token: result.token.id,
        fullName,
        ...props.regObj,
      }),
      headers: {
        "Content-type": "application/json",
      },
    }).then(async (response) => {
      const result = await response.json();
      if (result.status === "success") {
        props.RegisterSuccess();
       console.log("Such a  sneek you are!");
       console.log(result.url);
      } else {
        setErrorMessageState("Registration failed. try again.");
        setIsLoading(false);
      }
    });
  };

  return (
    <form className="text-center" onSubmit={handleSubmit}>
      <div className="form-group py-2">
        <div className=" col-12">
          <Input
            type="text"
            className="form-control "
            placeholder="Cardholder Name"
            required
            ref={cardholderRef}
          />
        </div>
      </div>

      <CardElement
        className={styles.customStyle}
        options={options}
        onReady={() => {}}
        onChange={(event) => {}}
        onBlur={() => {}}
        onFocus={() => {}}
      />
      <div className="form-group py-2 text-start">
        <lablel>
          {" "}
          You can use any of the stripe test card numbers.{" "}
          <a href="https://stripe.com/docs/testing" target="_blank">
            More Information
          </a>
        </lablel>
        <label>
          Number : 4242424242424242, CVC : Any, Date : Any Future Date{" "}
        </label>
      </div>
      <div className="form-group py-2">
        <small className="form-text text-danger">{errorMessageState}</small>
      </div>
      <Button
        type="submit"
        disabled={isLoading ? `true` : ``}
        text={!isLoading ? `Subscribe` : `Requesting...`}
        className="btn-warning mt-3"
      />
    </form>
  );
};

export default RegisterForm;
