import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

import styled from "styled-components";
import styles from "./Role.module.scss";
import Result from "../../../components/ui/Result";
import Card from "../../../components/ui/Card";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "../../../components/ui/Spinner";
import useEmployerHttp from "../../employer/hooks/useEmployerHttp";
import RoleRow from "../modules/RoleRow";
const Role = () => {
  const { isLoading, httpState, sendRequest } = useEmployerHttp();
  const roleNameRef = useRef();
  const [roleList, setRoleList] = useState([]);
  const [createRoleError, setCreateRoleError] = useState(null);
  const [createRoleMessage, setCreateRoleMessage] = useState(null);

  //create role checkboxes
  const LARef = useRef();
  const EPRef = useRef();
  const ERRef = useRef();
  const AVRef = useRef();
  const SERef = useRef();
  const SCRef = useRef();
  const BPRef = useRef();
  const EXRef = useRef();
  const MLRef = useRef();
  const RPRef = useRef();
  const PLRef = useRef();

  const successMethod = (data, dispatch) => {
    //setRoleList(data);
    dispatch({
      message: data.message || "success",
      active: true,
      type: "success",
    });

    setRoleList(data);

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

  const getRoles = useCallback(() => {
    sendRequest(
      { urlPath: "/employeeRole?page=1" },
      successMethod,
      failureMethod
    );
  }, [sendRequest]);
  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const createRoleHandler = (event) => {
    event.preventDefault();

    setCreateRoleError(null);
    setCreateRoleMessage(null);
    const roleName = roleNameRef.current.getValue();

    if (!/[a-zA-Z]/.test(roleName)) {
      setCreateRoleError("Role Name should have atleast one letter.");
      roleNameRef.current.focus();
      return;
    }

    sendRequest(
      {
        urlPath: "/employeeRole",
        method: "POST",
        body: JSON.stringify({
          roleName: roleName,
          LA: LARef.current.checked,
          EP: EPRef.current.checked,
          ER: ERRef.current.checked,
          AV: AVRef.current.checked,
          SE: SERef.current.checked,
          SC: SCRef.current.checked,
          BP: BPRef.current.checked,
          EX: EXRef.current.checked,
          ML: MLRef.current.checked,
          RP: RPRef.current.checked,
          PL: PLRef.current.checked,
        }),
      },
      () => {
        // browserHistory.push("/employer/employee/role");
        setCreateRoleMessage(
          "New Role Created. You can add another role or close this window."
        );
        roleNameRef.current.setValue("");
        LARef.current.checked = false;
        EPRef.current.checked = false;
        ERRef.current.checked = false;
        AVRef.current.checked = false;
        SERef.current.checked = false;
        SCRef.current.checked = false;
        EXRef.current.checked = false;
        MLRef.current.checked = false;
        RPRef.current.checked = false;
        PLRef.current.checked = false;

        getRoles();
        setTimeout(() => {
          setCreateRoleMessage(null);
          setCreateRoleError(null);
        }, 3000);
      },
      () => {
        setCreateRoleError(httpState.message || "Invalid Role Name");
      }
    );
  };

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div
          className={`modal fade ${styles["add-role-modal-id"]}`}
          id={`${styles["add-role-modal-id"]}`}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form className="text-center" onSubmit={createRoleHandler}>
                <div className="modal-header">
                  <h5 className="modal-title">Create New Role</h5>
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
                        placeholder="Role Name"
                        ref={roleNameRef}
                        required
                      />
                      <small className="form-text text-danger"></small>
                    </div>
                  </div>
                  <div className="row py-2 text-start">
                    <div className="form-group col-md-6">
                      <div class="form-check ">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={LARef}
                        />
                        <label class="form-check-label">
                          List All Employees
                        </label>
                      </div>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={EPRef}
                        />
                        <label class="form-check-label">Edit Profiles</label>
                      </div>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={ERRef}
                        />
                        <label class="form-check-label">Employee Roles</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={AVRef}
                        />
                        <label class="form-check-label">Availability</label>
                      </div>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={SERef}
                        />
                        <label class="form-check-label">Shift Exchange</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={SCRef}
                        />
                        <label class="form-check-label">Schedules</label>
                      </div>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={BPRef}
                        />
                        <label class="form-check-label">Blueprint</label>
                      </div>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={EXRef}
                        />
                        <label class="form-check-label">Exceptions</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={MLRef}
                        />
                        <label class="form-check-label">Manager Logs</label>
                      </div>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={RPRef}
                        />
                        <label class="form-check-label">Reports</label>
                      </div>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          ref={PLRef}
                        />
                        <label class="form-check-label">Print Lineup</label>
                      </div>
                    </div>
                  </div>

                  <br />

                  {createRoleError ? (
                    <Result
                      message={createRoleError}
                      type="error"
                      format="paragraph"
                    />
                  ) : (
                    ""
                  )}
                  {createRoleMessage ? (
                    <Result
                      message={createRoleMessage}
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
        <div className={`col  col-xl-12 col-md-12   `}>
          <Card className="py-3 px-4">
            <h3>
              Employee Roles
              <Button
                type="button"
                className="btn-warning float-end"
                text="New Role"
                data-bs-toggle="modal"
                data-bs-target={`#${styles["add-role-modal-id"]}`}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </h3>
            <div className="table-responsive">
              <table className="table sched-table table-borderless align-middle">
                <thead className="">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col"></th>
                    <th scope="col">LA</th>
                    <th scope="col">EP</th>
                    <th scope="col">ER</th>
                    <th scope="col">AV</th>
                    <th scope="col">SE</th>
                    <th scope="col">SC</th>
                    <th scope="col">BP</th>
                    <th scope="col">EX</th>
                    <th scope="col">ML</th>
                    <th scope="col">RP</th>
                    <th scope="col">PL</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr className="text-center">
                      <td colSpan="100%">
                        <Spinner />
                      </td>
                    </tr>
                  ) : httpState.active && httpState.type === "error" ? (
                    <Result
                      message={httpState.message}
                      type={httpState.type}
                      format="table"
                    />
                  ) : roleList.length <= 0 ? (
                    <tr className="text-center">
                      <td colSpan="100%">No Data.</td>
                    </tr>
                  ) : (
                    roleList.map((value, index) => (
                      <RoleRow index={index} element={value} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="row px-2 ">
        <div className={`col col-xl-12 col-md-12    `}>
          <Card className="py-3 px-4">
            <InfoTable>
              <tbody>
                <tr>
                  <td width="50" align="left">
                    Key
                  </td>
                  <td width="300" align="left">
                    Full Title
                  </td>
                  <td align="left">Description</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td width="50" align="left">
                    <b>LA</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    List All Employees
                  </td>
                  <td align="left">
                    View a full list of employees and access thier profiles.
                  </td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>EP</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Edit Profiles
                  </td>
                  <td align="left">
                    Update employee information (roles, wages, ratings etc.).
                  </td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>ER</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Employee Roles
                  </td>
                  <td align="left">
                    Create, and edit Employee Roles and thier permissions.
                  </td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>AV</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Availability
                  </td>
                  <td align="left">
                    Allow Employees to fill out thier availability.
                  </td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>SE</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Shift Exchange
                  </td>
                  <td align="left">
                    Grant access to approve or deny shift exchanges between
                    employees.
                  </td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>SC</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Scheduling
                  </td>
                  <td align="left">
                    Grant access to create, edit, and post schedules.
                  </td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>BP</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Blueprint
                  </td>
                  <td align="left">Allow employees to create Blueprints.</td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>EX</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Exceptions
                  </td>
                  <td align="left">
                    Employees can create exceptions in order to prevent us from
                    auto-scheduling a particular day.
                  </td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>ML</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Manager Logs
                  </td>
                  <td align="left">
                    Grant access to create, and fill out manager logs for your
                    company.
                  </td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>RP</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Reports
                  </td>
                  <td align="left">
                    Full detailed reports, and analytics of your company
                  </td>
                </tr>
                <tr>
                  <td width="50" align="left">
                    <b>PL</b>
                  </td>
                  <td className="highlight" width="300" align="left">
                    Print Lineup
                  </td>
                  <td align="left">
                    Grant access to print a lineup sheet for the day or for the
                    week.
                  </td>
                </tr>
              </tbody>
            </InfoTable>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Role;

const InfoTable = styled.table`
  .highlight {
    color: #e5ae07;
  }
`;
