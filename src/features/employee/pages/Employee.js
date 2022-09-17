import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./Employee.module.scss";
import Card from "../../../components/ui/Card";
import Button from "../../../components/Button";
import useEmployerHttp from "../../employer/hooks/useEmployerHttp";
import Spinner from "../../../components/ui/Spinner";
import Result from "../../../components/ui/Result";
import EmployeeRow from "../modules/EmployeeRow";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
const Employee = () => {
  const { isLoading, httpState, sendRequest } = useEmployerHttp();
  const {
    isLoading: loadMoreIsLoading,
    httpState: loadMoreHttpState,
    sendRequest: loadMoreSendRequest,
  } = useEmployerHttp();

  const { sendRequest: employeeRoleSendRequest } = useEmployerHttp();

  const [employeeList, setEmployeeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [createEmployeeError, setCreateEmployeeError] = useState(null);
  const [createEmployeeMessage, setCreateEmployeeMessage] = useState(null);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const employeeRolesRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const successMethod = (data, dispatch) => {
    dispatch({
      message: data.message || "success",
      active: true,
      type: "success",
    });

    setEmployeeList(data);

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

  const getEmployees = useCallback(() => {
    sendRequest({ urlPath: "/employee?page=1" }, successMethod, failureMethod);
  }, [sendRequest]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  useEffect(() => {
    employeeRoleSendRequest(
      {
        urlPath: "/employeeRole?mode=dropdown",
      },
      (result, dispatch) => {
        const tempResult = result.map((value) => {
          return { value: value._id, text: value.roleName };
        });

        setEmployeeRoles(tempResult);
      },
      () => {}
    );
  }, [employeeRoleSendRequest]);

  const loadMoreEmployees = () => {
    loadMoreSendRequest(
      { urlPath: "/employee?page=" + (currentPage + 1) },
      (data, dispatch) => {
        if (data.length >= 1) {
          dispatch({
            message: data.message || "success",
            active: true,
            type: "success",
          });

          setEmployeeList((prevState) => {
            return [...prevState, ...data];
          });

          setTimeout(() => {
            dispatch({
              message: "",
              active: false,
              type: "",
            });
          }, 3000);
          setCurrentPage((prevState) => {
            return prevState + 1;
          });
        } else {
          dispatch({
            message: "No Data.",
            active: true,
            type: "error",
          });

          setTimeout(() => {
            dispatch({
              message: "",
              active: false,
              type: "",
            });
          }, 3000);

          setCurrentPage(null);
        }
      },
      failureMethod
    );
  };

  const createEmployeeHandler = (event) => {
    event.preventDefault();

    setCreateEmployeeError(null);
    setCreateEmployeeMessage(null);
    const name = nameRef.current.getValue();
    const email = emailRef.current.getValue();
    const employeeRoleId = employeeRolesRef.current.getValue();

    if (!/[a-zA-Z]/.test(name)) {
      setCreateEmployeeError("Role Name should have atleast one letter.");
      nameRef.current.focus();
      return;
    }

    sendRequest(
      {
        urlPath: "/employee",
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email,
          employeeRoleId: employeeRoleId,
        }),
      },
      () => {
        // browserHistory.push("/employer/employee/role");
        setCreateEmployeeMessage(
          "New Employee Created. You can add another employee or close this window."
        );
        setCurrentPage(1);
        setEmployeeList([]);
        getEmployees();
        setTimeout(() => {
          setCreateEmployeeMessage(null);
          setCreateEmployeeError(null);
        }, 3000);
      },
      (result, dispatchHttpState) => {
        setCreateEmployeeError("Invalid Name" && result?.message);
      }
    );
  };
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div
          className={`modal fade ${styles["add-employee-modal-id"]}`}
          id={`${styles["add-employee-modal-id"]}`}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form className="text-center" onSubmit={createEmployeeHandler}>
                <div className="modal-header">
                  <h5 className="modal-title">Create New Employee</h5>
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
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        ref={nameRef}
                        required
                      />
                      <small className="form-text text-danger"></small>
                    </div>
                  </div>
                  <div className="row py-2">
                    <div className="form-group col-md-6">
                      <Input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        ref={emailRef}
                        required
                      />
                    </div>
                  </div>
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

                  <br />

                  {createEmployeeError ? (
                    <Result
                      message={createEmployeeError}
                      type="error"
                      format="paragraph"
                    />
                  ) : (
                    ""
                  )}
                  {createEmployeeMessage ? (
                    <Result
                      message={createEmployeeMessage}
                      type="success"
                      format="paragraph"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="modal-footer">
                  {isLoading ? (
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

      <div className="row px-2 mt-5 ">
        <div className={`col col-xl-12 col-md-12  `}>
          <Card className="py-3 px-4">
            <h3>
              Employees
              <Button
                type="button"
                className="btn-warning float-end"
                text="Add Employee"
                data-bs-toggle="modal"
                data-bs-target={`#${styles["add-employee-modal-id"]}`}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </h3>

            <div className="table-responsive">
              <table className="table sched-table table-borderless align-middle">
                <thead className="">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>

                {isLoading ? (
                  <tbody>
                    <tr className="text-center">
                      <td colSpan="100%">
                        <Spinner />
                      </td>
                    </tr>
                  </tbody>
                ) : httpState.active && httpState.type === "error" ? (
                  <tbody>
                    <Result
                      message={httpState.message}
                      type={httpState.type}
                      format="table"
                    />
                  </tbody>
                ) : employeeList.length <= 0 ? (
                  <tbody>
                    <tr className="text-center">
                      <td colSpan="100%">No Data.</td>
                    </tr>
                  </tbody>
                ) : (
                  <React.Fragment>
                    <tbody>
                      {employeeList.map((value, index) => (
                        <EmployeeRow
                          index={index}
                          element={value}
                          employeeRoles={employeeRoles}
                        />
                      ))}
                    </tbody>
                    {loadMoreIsLoading ? (
                      <tbody>
                        <tr className="text-center">
                          <td colSpan="100%">
                            <Spinner />
                          </td>
                        </tr>
                      </tbody>
                    ) : loadMoreHttpState.active &&
                      loadMoreHttpState.type === "error" ? (
                      <tbody>
                        <Result
                          message={loadMoreHttpState.message}
                          type={loadMoreHttpState.type}
                          format="table"
                        />
                      </tbody>
                    ) : (
                      currentPage && (
                        <tbody>
                          <tr>
                            <td colspan="100%" className="text-center">
                              <Button
                                type="button"
                                className="btn-warning"
                                onClick={loadMoreEmployees}
                                aria-label="Load More"
                              >
                                <FontAwesomeIcon icon={faArrowCircleDown} />
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      )
                    )}
                  </React.Fragment>
                )}
              </table>
            </div>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Employee;
