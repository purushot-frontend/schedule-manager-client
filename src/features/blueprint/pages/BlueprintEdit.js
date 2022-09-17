import React, { useEffect, useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Card from "../../../components/ui/Card";
import useEmployerHttp from "../../employer/hooks/useEmployerHttp";
import Spinner from "../../../components/ui/Spinner";
import Result from "../../../components/ui/Result";
import BlueprintTimeSlot from "../modules/BlueprintTimeSlot";
import styles from "./BlueprintEdit.module.scss";
import Button from "./../../../components/Button";
import Select from "./../../../components/Select";
import Input from "../../../components/Input";
import times from "../../../constants/timePicker";
const BlueprintEdit = () => {
  const { isLoading, httpState, sendRequest } = useEmployerHttp();
  const {
    isLoading: isNewShiftLoading,

    sendRequest: newShiftSendRequest,
  } = useEmployerHttp();
  const [blueprintData, setBlueprintData] = useState({});

  const [createShiftError, setCreateShiftError] = useState(null);
  const [createShiftMessage, setCreateShiftMessage] = useState(null);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const { sendRequest: employeeRoleSendRequest } = useEmployerHttp();
  const employeeRolesRef = useRef();
  const requiredEmployeesRef = useRef();
  const daysRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const { blueprintId } = useParams();

  useEffect(() => {
    employeeRoleSendRequest(
      {
        urlPath: "/employeeRole?mode=dropdown",
      },
      (result, dispatch) => {
        const tempResult = result.map((value) => {
          return { value: value._id, text: value.roleName };
        });

        setEmployeeRoles(tempResult || []);
      },
      () => {}
    );
  }, [employeeRoleSendRequest]);
  const successMethod = (data, dispatch) => {
    dispatch({
      message: data.message || "success",
      active: true,
      type: "success",
    });

    setBlueprintData(data);

    setTimeout(() => {
      dispatch({
        message: "",
        active: false,
        type: "",
      });
    }, 3000);
  };

  const failureMethod = (result, dispatch) => {
    dispatch({
      message: result.message || "Error.",
      active: true,
      type: "error",
    });
  };

  const getBlueprints = useCallback(() => {
    sendRequest(
      { urlPath: "/blueprint/" + blueprintId },
      successMethod,
      failureMethod
    );
  }, [sendRequest, blueprintId]);
  useEffect(() => {
    getBlueprints();
  }, [getBlueprints]);

  const createShiftHandler = (event) => {
    event.preventDefault();

    setCreateShiftError(null);
    setCreateShiftMessage(null);
    const employeeRoleId = employeeRolesRef.current.getValue();
    const requiredEmployees = requiredEmployeesRef.current.getValue();
    const day = daysRef.current.getValue();
    const startTime = startTimeRef.current.getValue();
    const endTime = endTimeRef.current.getValue();
    newShiftSendRequest(
      {
        urlPath: "/blueprint/" + blueprintId + "/timeSlot",
        method: "POST",
        body: JSON.stringify({
          employeeRoleId: employeeRoleId,
          requiredEmployees: requiredEmployees,
          day: day,
          startTime: startTime,
          endTime: endTime,
        }),
      },
      () => {
        // browserHistory.push("/employer/employee/role");
        setCreateShiftMessage(
          "New Shift Created. You can add another one or close this window."
        );
        getBlueprints();
        setTimeout(() => {
          setCreateShiftMessage(null);
          setCreateShiftError(null);
        }, 3000);
      },
      (result) => {
        setCreateShiftError(
          result.message ||
            (result.errors
              ? result.errors.reduce(
                  (prevVal, curVal) => `${curVal?.msg} ` + prevVal,
                  ""
                )
              : "Invalid Request")
        );
      }
    );
  };

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div
          className={`modal fade ${styles["add-blueprint-shift-modal-id"]}`}
          id={`${styles["add-blueprint-shift-modal-id"]}`}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form className="text-center" onSubmit={createShiftHandler}>
                <div className="modal-header">
                  <h5 className="modal-title">Create New Shift</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row py-2">
                    <div className="form-group col-md-6">
                      <div className="row">
                        <div className="col-md-12">
                          <Select
                            data={employeeRoles}
                            id={styles["select-id"]}
                            defaultOption="--- select role---"
                            className="sched-select form-select"
                            ref={employeeRolesRef}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row py-2">
                    <div className="form-group col-md-6">
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Required Number Of Employees"
                        ref={requiredEmployeesRef}
                        required
                      />
                      <small className="form-text text-danger"></small>
                    </div>
                  </div>

                  <div className="row py-2">
                    <div className="form-group col-md-6">
                      <div className="row">
                        <div className="col-md-12">
                          <Select
                            data={days}
                            id={styles["select-day-id"]}
                            defaultOption="--- select day---"
                            className="sched-select form-select"
                            ref={daysRef}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row py-2">
                    <div className="form-group col-md-6">
                      <div className="row">
                        <div className="col-md-12">
                          <Select
                            data={times}
                            id={styles["select-start-time-id"]}
                            defaultOption="--- select start time ---"
                            className="sched-select form-select"
                            ref={startTimeRef}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row py-2">
                    <div className="form-group col-md-6">
                      <div className="row">
                        <div className="col-md-12">
                          <Select
                            data={times}
                            id={styles["select-end-time-id"]}
                            defaultOption="--- select end time ---"
                            className="sched-select form-select"
                            ref={endTimeRef}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row py-2">
                    <div className="form-group col-md-6"></div>
                  </div>

                  {createShiftError ? (
                    <Result
                      message={createShiftError}
                      type="error"
                      format="paragraph"
                    />
                  ) : (
                    ""
                  )}
                  {createShiftMessage ? (
                    <Result
                      message={createShiftMessage}
                      type="success"
                      format="paragraph"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="modal-footer">
                  {isNewShiftLoading ? (
                    <Spinner />
                  ) : (
                    <React.Fragment>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <Button
                        type="submit"
                        className="btn-primary"
                        text="Create"
                      />
                    </React.Fragment>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.getElementById("modal-root")
      )}

      <div className="row px-2 ">
        <div className={`col  col-12    `}>
          <Card className="py-3 px-4">
            {httpState.active && httpState.type === "error" ? (
              <Result
                message={httpState.message}
                type={httpState.type}
                format="table"
              />
            ) : (
              <React.Fragment>
                <h3>
                  Blueprint - {blueprintData?.name}{" "}
                  <Button
                    type="button"
                    className="btn-warning float-end"
                    text="New Shift"
                    data-bs-toggle="modal"
                    data-bs-target={`#${styles["add-blueprint-shift-modal-id"]}`}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </h3>
                <div className="table-responsive">
                  <table className="table sched-table table-bordered align-middle">
                    <tr>
                      <td></td>
                      <td>Mon</td>
                      <td>Tue</td>
                      <td>Wed</td>
                      <td>Thu</td>
                      <td>Fri</td>
                      <td>Sat</td>
                      <td>Sun</td>
                    </tr>
                    {employeeRoles.length > 0
                      ? employeeRoles.map((roleData, index) => (
                          <tr>
                            <td>{roleData?.text}</td>

                            {days.map((day) => (
                              <td>
                                {blueprintData?.timeSlot?.length > 0
                                  ? blueprintData.timeSlot
                                      .filter(
                                        (timeSlot) =>
                                          timeSlot.day === day &&
                                          timeSlot.employeeRoleId ===
                                            roleData.value
                                      )
                                      .map((timeSlot) => (
                                        <BlueprintTimeSlot
                                          roleData={roleData}
                                          timeSlot={timeSlot}
                                          blueprintId={blueprintData._id}
                                        />
                                      ))
                                  : ""}
                              </td>
                            ))}
                          </tr>
                        ))
                      : ""}
                  </table>
                </div>
              </React.Fragment>
            )}

            {isLoading && (
              <div className="text-center">
                <Spinner />
              </div>
            )}
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BlueprintEdit;
