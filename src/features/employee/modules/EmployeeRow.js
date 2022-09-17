import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./EmployeeRow.module.scss";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./../../../components/Button";
import Input from "../../../components/Input";
import useEmployerHttp from "../../employer/hooks/useEmployerHttp";
import Spinner from "../../../components/ui/Spinner";
import Result from "../../../components/ui/Result";
import Select from "../../../components/Select";
function EmployeeRow(props) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const { isLoading, sendRequest } = useEmployerHttp();
  const [editEmployeeError, setEditEmployeeError] = useState(null);
  const [editEmployeeMessage, setEditEmployeeMessage] = useState(null);
  const [data, setData] = useState({});
  const nameRef = useRef();

  const employeeRolesRef = useRef();
  useEffect(() => {
    setData({
      index: props.index,
      ...props.element,
      employeeRoles: props.employeeRoles,
    });

    setDataLoaded(true);
  }, [props]);

  const editEmployeeHandler = (event) => {
    event.preventDefault();

    setEditEmployeeError(null);
    setEditEmployeeMessage(null);

    sendRequest(
      {
        urlPath: "/employee/" + data._id,
        method: "PATCH",
        body: JSON.stringify({
          name: nameRef.current.getValue(),

          employeeRoleId: employeeRolesRef.current.getValue(),
        }),
      },
      (result, dispatch) => {
        // browserHistory.push("/employer/employee/role");
        setEditEmployeeMessage("Updated.");
        setData((prevData) => {
          return { ...prevData, ...result };
        });
        //update state
        setTimeout(() => {
          setEditEmployeeMessage(null);
          setEditEmployeeError(null);
        }, 3000);
      },
      (error, dispatch) => {
        setEditEmployeeError(error.message || "Invalid Request");
      }
    );
  };
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div
          className={`modal fade ${styles["edit-employee-modal-id"]}`}
          id={`${styles["edit-employee-modal-id"]}${data.index}`}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            {!dataLoaded ? (
              <tr>
                <td colspan="100%" className=" text-center">
                  <Spinner />
                </td>
              </tr>
            ) : (
              <div className="modal-content">
                <form className="text-center" onSubmit={editEmployeeHandler}>
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Employee</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row py-2 text-start">
                      <div className="form-group col-md-6">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          value={data.name}
                          ref={nameRef}
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
                              data={data.employeeRoles}
                              id={`${styles["select-id"]}${data.index}`}
                              defaultOption="--- select role---"
                              className="sched-select form-select"
                              ref={employeeRolesRef}
                              selected={{
                                value: data.employeeRoleId,
                                name: data?.roleData?.roleName,
                              }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {editEmployeeError ? (
                      <Result
                        message={editEmployeeError}
                        type="error"
                        format="paragraph"
                      />
                    ) : (
                      ""
                    )}
                    {editEmployeeMessage ? (
                      <Result
                        message={editEmployeeMessage}
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
                          text="Save"
                        />
                      </React.Fragment>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>,
        document.getElementById("modal-root")
      )}

      <React.Fragment>
        {!dataLoaded ? (
          <tr>
            <td colspan="100%" className=" text-center">
              <Spinner />
            </td>
          </tr>
        ) : (
          <tr>
            <td>{data?.index + 1}</td>
            <td>{data?.name}</td>
            <td>{data?.email}</td>
            <td>{data?.roleData?.roleName}</td>

            <td>
              <Button
                type="button"
                className="btn-warning float-end"
                text=""
                data-bs-toggle="modal"
                data-bs-target={`#${styles["edit-employee-modal-id"]}${data.index}`}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </td>
          </tr>
        )}
      </React.Fragment>
    </React.Fragment>
  );
}

export default EmployeeRow;
