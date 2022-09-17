/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useContext,
  useEffect,
  useState,
  useReducer,
  useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Card from "../../../components/ui/Card";
import Button from "../../../components/Button";
import Spinner from "../../../components/ui/Spinner";
import Input from "../../../components/Input";
import Select from "../../../components/Select";

import AuthContext from "../../../store/authcontext";
import CompanyList from "../modules/CompanyList";
import styles from "./Companies.module.css";
import timeZones from "../../../constants/timeZones";
import backendURL from "../../../constants/config";
const addLocationMessage = { message: "", active: false, type: "" };

function addLocationMessageReducer(state, action) {
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

const Companies = () => {
  const authCtx = useContext(AuthContext);
  const [companyList, setCompanyList] = useState([]);
  const [isLoading, SetIsLoading] = useState(true);
  const [isAddLocationFormSubmitting, setIsAddLocationFormSubmitting] =
    useState(false);
  const [addLocationMessageState, dispatchLocationMessage] = useReducer(
    addLocationMessageReducer,
    addLocationMessage
  );
  const companyNameRef = useRef();
  const timeZoneRef = useRef();
  //const locationModalId = styles["add-location-modal-id"];
  const addNewLocationHandler = async (event) => {
    event.preventDefault();
    setIsAddLocationFormSubmitting(true);
    dispatchLocationMessage({ type: "reset" });
    const companyName = companyNameRef.current.getValue();
    if (!/[a-zA-Z]/.test(companyName)) {
      dispatchLocationMessage({
        type: "fail",
        message: "Company Name should have atleast one letter.",
      });

      companyNameRef.current.focus();
      return;
    }

    const timeZone = timeZoneRef.current.getValue();

    const response = await fetch(backendURL + "/api/v1/user/company/", {
      method: "POST",
      body: JSON.stringify({
        companyName,
        timeZone,
      }),
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
        "Content-type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status === "success") {
      dispatchLocationMessage({
        type: "success",
        message:
          "New Company Created. You can add another company or close this window.",
      });

      authCtx.updateData(result.data.user);

      setTimeout(() => {
        dispatchLocationMessage({ type: "reset" });
        setIsAddLocationFormSubmitting(false);
      }, 3000);
    } else {
      setIsAddLocationFormSubmitting(false);
      dispatchLocationMessage({ type: "fail", message: result.message });
      setTimeout(() => {
        dispatchLocationMessage({ type: "reset" });
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      SetIsLoading(true);
      const response = await fetch(backendURL + "/api/v1/user/me", {
        method: "GET",

        headers: { Authorization: `Bearer ${authCtx.token}` },
      });

      const result = await response.json();

      if (result.status !== "success") {
        authCtx.removeLogin();
        return;
      }
      // const thisData =
      //  result.data.companies.length > 0 ? result.data.companies : [];
      // setCompanyList(thisData);

      authCtx.updateData(result.data);

      SetIsLoading(false);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    setCompanyList(authCtx.data.companies);
  }, [authCtx.data.companies]);

  return (
    <React.Fragment>
      <div
        className={`modal fade ${styles["add-location-modal-id"]}`}
        id={`${styles["add-location-modal-id"]}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <form className="text-center" onSubmit={addNewLocationHandler}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add New Location
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Completing the following details will increase your monthly
                  subsciption by $40.00. Please enter your company name, and the
                  time zone your company operates in.
                </p>
                <div className="row py-2">
                  <div className="form-group col-md-6">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Company Name"
                      required
                      ref={companyNameRef}
                    />
                    <small className="form-text text-danger"></small>
                  </div>
                  <div className="form-group col-md-6">
                    <Select
                      data={timeZones}
                      id={styles["select-timezone-id"]}
                      defaultOption="--- select timezone ---"
                      className="sched-select form-select text-center"
                      required
                      ref={timeZoneRef}
                    />
                  </div>
                </div>
                <br />

                <p className={addLocationMessageState.class}>
                  {addLocationMessageState.message}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                {isAddLocationFormSubmitting ? (
                  <Spinner />
                ) : (
                  <Button type="submit" className="btn-primary" text="Create" />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className={` col col-12 mt-5  mb-1 py-2 px-2 `}>
        <Card className="py-2 px-2 mb-3 text-center">
          <h3>
            Locations
            <Button
              type="button"
              className="btn-success float-end"
              text="Add Location"
              data-bs-toggle="modal"
              data-bs-target={`#${styles["add-location-modal-id"]}`}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </h3>
        </Card>
      </div>
      <div className="row px-2 ">
        <div className={`col  col-12    `}>
          <Card className="py-3 px-4">
            <div className="table-responsive">
              <table className="table sched-table table-borderless align-middle">
                <thead className="">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Company</th>
                    <th scope="col">Time Zone</th>
                    <th scope="col">Active</th>
                    <th scope="col">Auto-Renew</th>
                    <th scope="col">Renewal Date</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr className="text-center">
                      <td colSpan="7">
                        <Spinner />
                      </td>
                    </tr>
                  ) : (
                    companyList.map((element, index) => (
                      <CompanyList
                        key={index}
                        element={element}
                        index={index}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Companies;
