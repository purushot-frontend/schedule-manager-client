import React, { useState, useEffect, useContext } from "react";
import Button from "../../../components/Button";
import Spinner from "../../../components/ui/Spinner";
import AuthContext from "../../../store/authcontext";
import backendURL from "../../../constants/config";
const CompanyList = (props) => {
  const [expiryDate, SetExpiryDate] = useState("");
  const [companyStatus, SetCompanyStatus] = useState("");
  const [autoRenew, SetAutoRenew] = useState(false);
  const [isLoading, SetIsLoading] = useState(true);
  const [isToggling, SetIsToggling] = useState(false);
  const authCtx = useContext(AuthContext);

  //   const getDate = (timezone) => {
  //     return new Date().toLocaleString("en-US", {
  //       timeZone: "" + timezone + "",
  //     });
  //   };

  const timeStampToDate = (timestamp, timezone) => {
    return new Date(timestamp * 1000).toLocaleString("en-UK", {
      timeZone: "" + timezone + "",

      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  //   function toTimeStamp(strDate) {
  //     var datum = Date.parse(strDate);
  //     return datum / 1000;
  //   }

  const toggleRenew = async () => {
    SetIsToggling(true);
    const response = await fetch(
      backendURL +
        "/api/v1/user/company/" +
        props.element._id +
        "/toggleRenewal",
      {
        method: "GET",

        headers: { Authorization: `Bearer ${authCtx.token}` },
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      SetAutoRenew(!result.data.new_cancel_at_period_end);
    }
    SetIsToggling(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        backendURL + "/api/v1/user/company/" + props.element._id,
        {
          method: "GET",

          headers: { Authorization: `Bearer ${authCtx.token}` },
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        SetExpiryDate(
          timeStampToDate(
            result.data.current_period_end,
            props.element.timeZone
          )
        );
        SetCompanyStatus(result.data.status);
        SetAutoRenew(!result.data.cancel_at_period_end);
      } else {
        SetExpiryDate("error");
        SetCompanyStatus("error");
      }
      SetIsLoading(false);
    };
    fetchUserData();
  }, []);
  return (
    <React.Fragment>
      <tr className="">
        <td>{props.index + 1}</td>
        <td>{props.element.name}</td>
        <td>{props.element.timeZone}</td>
        <td>
          {isLoading ? (
            <Spinner />
          ) : (
            <span
              className={`badge  bg-${
                companyStatus === "active" ? "success" : "danger"
              }`}
            >
              {companyStatus}
            </span>
          )}
        </td>
        <td>
          {isLoading || isToggling ? (
            <Spinner />
          ) : (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                defaultChecked={autoRenew}
                onClick={toggleRenew}
              />
            </div>
          )}
        </td>
        <td>{isLoading ? <Spinner /> : expiryDate}</td>
      </tr>
    </React.Fragment>
  );
};

export default CompanyList;
