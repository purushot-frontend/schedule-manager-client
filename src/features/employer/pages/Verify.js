import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import backendURL from "../../../constants/config";
//useRouteMatch, useParams,
const Verify = () => {
  const [verificationStatus, setVerficationStatus] = useState({
    class: "text-default",
    subject: "Verifying Account...",
    content: "please wait..",
    changed: false,
  });
  // const email = useParams();
  // const activationToken = useRouteMatch();

  let urlParams = new URLSearchParams(useLocation().search);

  useEffect(() => {
    const email = urlParams.get("email");
    const activationToken = urlParams.get("activationToken");

    // pass the token to your backend API
    fetch(backendURL + "/api/v1/user/verifyAccount", {
      method: "POST",
      body: JSON.stringify({
        email,
        activationToken,
      }),
      headers: {
        "Content-type": "application/json",
      },
    }).then(async (response) => {
      const result = await response.json();

      if (result.status === "success") {
        setVerficationStatus({
          class: "text-success",
          subject: "Account Verified!",
          content:
            "Welcome to Schedule Manager! You can now login and manage your business",
          changed: true,
        });
      } else {
        setTimeout(() => {
          setVerficationStatus({
            class: "text-danger",
            subject: "Verification failed :(",
            content: `invalid URL or account is already got activated. 
                          Don't worry, you will not be charged if your account not got activated , hence you can try register again`,
            changed: true,
          });
        }, 3000);
      }
    });
  }, []);

  return (
    <main className="container">
      <div className="bg-dark p-5 mt-5 rounded">
        <h1 className={verificationStatus.class}>
          {verificationStatus.subject}
        </h1>
        <p className="lead">{verificationStatus.content}</p>

        {verificationStatus.changed && (
          <Link className="btn btn-warning" to="/">
            Login
          </Link>
        )}
      </div>
    </main>
  );
};

export default Verify;
