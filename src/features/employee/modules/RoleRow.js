import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./RoleRow.module.scss";
import {
  faCheckCircle,
  faTimesCircle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./../../../components/Button";
import useEmployerHttp from "../../employer/hooks/useEmployerHttp";
import Spinner from "../../../components/ui/Spinner";
import Result from "../../../components/ui/Result";

function RoleRow(props) {
  const { isLoading, httpState, sendRequest } = useEmployerHttp();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [editRoleError, setEditRoleError] = useState(null);
  const [editRoleMessage, setEditRoleMessage] = useState(null);
  const [data, setData] = useState({});

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

  const CloseButtonForEditModal = useRef();

  useEffect(() => {
    setData({ index: props.index, ...props.element });
    /* LARef.current.checked = props.element.LA.selected;
    EPRef.current.checked = props.element.EP.selected;
    ERRef.current.checked = props.element.ER.selected;
    AVRef.current.checked = props.element.AV.selected;
    SERef.current.checked = props.element.SE.selected;
    SCRef.current.checked = props.element.SC.selected;
    BPRef.current.checked = props.element.BP.selected;
    EXRef.current.checked = props.element.EX.selected;
    MLRef.current.checked = props.element.ML.selected;
    RPRef.current.checked = props.element.RP.selected;
    PLRef.current.checked = props.element.PL.selected;*/

    setDataLoaded(true);
  }, [props]);

  const editRoleHandler = (event) => {
    event.preventDefault();

    setEditRoleError(null);
    setEditRoleMessage(null);

    sendRequest(
      {
        urlPath: "/employeeRole/" + data._id,
        method: "PATCH",
        body: JSON.stringify({
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
      (result, dispatch) => {
        // browserHistory.push("/employer/employee/role");
        setEditRoleMessage("Role Updated.");
        setData((prevData) => {
          return { ...prevData, ...result };
        });
        //update state
        setTimeout(() => {
          setEditRoleMessage(null);
          setEditRoleError(null);
          //closeOneModal(`${styles["edit-role-modal-id"]}${data.index}`);
          CloseButtonForEditModal.current.click();
        }, 3000);
      },
      () => {
        setEditRoleError(httpState.message || "Invalid Role Name");
      }
    );
  };

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div
          className={`modal fade ${styles["edit-role-modal-id"]}`}
          id={`${styles["edit-role-modal-id"]}${data.index}`}
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
                <form className="text-center" onSubmit={editRoleHandler}>
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Role - {data.roleName}</h5>
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
                        <div class="form-check ">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ref={LARef}
                            defaultChecked={data.LA.selected}
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
                            defaultChecked={data.EP.selected}
                          />
                          <label class="form-check-label">Edit Profiles</label>
                        </div>

                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ref={ERRef}
                            defaultChecked={data.ER.selected}
                          />
                          <label class="form-check-label">Employee Roles</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ref={AVRef}
                            defaultChecked={data.AV.selected}
                          />
                          <label class="form-check-label">Availability</label>
                        </div>

                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ref={SERef}
                            defaultChecked={data.SE.selected}
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
                            defaultChecked={data.SC.selected}
                          />
                          <label class="form-check-label">Schedules</label>
                        </div>

                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ref={BPRef}
                            defaultChecked={data.BP.selected}
                          />
                          <label class="form-check-label">Blueprint</label>
                        </div>

                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ref={EXRef}
                            defaultChecked={data.EX.selected}
                          />
                          <label class="form-check-label">Exceptions</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ref={MLRef}
                            defaultChecked={data.ML.selected}
                          />
                          <label class="form-check-label">Manager Logs</label>
                        </div>

                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ref={RPRef}
                            defaultChecked={data.RP.selected}
                          />
                          <label class="form-check-label">Reports</label>
                        </div>

                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            ref={PLRef}
                            defaultChecked={data.PL.selected}
                          />
                          <label class="form-check-label">Print Lineup</label>
                        </div>
                      </div>
                    </div>

                    <br />

                    {editRoleError ? (
                      <Result
                        message={editRoleError}
                        type="error"
                        format="paragraph"
                      />
                    ) : (
                      ""
                    )}
                    {editRoleMessage ? (
                      <Result
                        message={editRoleMessage}
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
                          ref={CloseButtonForEditModal}
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

      {!dataLoaded ? (
        <tr>
          <td colspan="100%" className=" text-center">
            <Spinner />
          </td>
        </tr>
      ) : (
        <tr>
          <td>{data.index + 1}</td>
          <td>{data.roleName}</td>
          <td>
            {data.LA.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.EP.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.ER.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.AV.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.SE.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.SC.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.BP.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.EX.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.ML.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.RP.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            {data.PL.selected ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} color="red" />
            )}
          </td>
          <td>
            <Button
              type="button"
              className="btn-warning float-end"
              text=""
              data-bs-toggle="modal"
              data-bs-target={`#${styles["edit-role-modal-id"]}${data.index}`}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default RoleRow;
