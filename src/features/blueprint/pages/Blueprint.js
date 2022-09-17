import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./Blueprint.module.scss";
import Card from "../../../components/ui/Card";
import Button from "../../../components/Button";
import useEmployerHttp from "../../employer/hooks/useEmployerHttp";
import Spinner from "../../../components/ui/Spinner";
import Result from "../../../components/ui/Result";
import BlueprintRow from "../modules/BlueprintRow";
import Input from "../../../components/Input";
const Blueprint = () => {
  const { isLoading, httpState, sendRequest } = useEmployerHttp();
  const {
    isLoading: loadMoreIsLoading,
    httpState: loadMoreHttpState,
    sendRequest: loadMoreSendRequest,
  } = useEmployerHttp();
  const [blueprintList, setBlueprintList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blueprintNameRef = useRef();
  const [createBlueprintError, setCreateBlueprintError] = useState(null);
  const [createBlueprintMessage, setCreateBlueprintMessage] = useState(null);
  const history = useHistory();
  const closeButtonForCreateModal = useRef();
  const successMethod = (data, dispatch) => {
    dispatch({
      message: data.message || "success",
      active: true,
      type: "success",
    });

    setBlueprintList(data);

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
    sendRequest({ urlPath: "/blueprint?page=1" }, successMethod, failureMethod);
  }, [sendRequest]);

  useEffect(() => {
    getBlueprints();
  }, [getBlueprints]);

  const loadMoreBlueprints = () => {
    loadMoreSendRequest(
      { urlPath: "/blueprint?page=" + (currentPage + 1) },
      (data, dispatch) => {
        if (data.length >= 1) {
          dispatch({
            message: data.message || "success",
            active: true,
            type: "success",
          });

          setBlueprintList((prevState) => {
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

  const createBlueprintHandler = (event) => {
    event.preventDefault();

    setCreateBlueprintError(null);
    setCreateBlueprintMessage(null);
    const blueprintName = blueprintNameRef.current.getValue();

    if (!/[a-zA-Z]/.test(blueprintName)) {
      setCreateBlueprintError("Blueprint Name should have atleast one letter.");
      blueprintNameRef.current.focus();
      return;
    }

    sendRequest(
      {
        urlPath: "/blueprint",
        method: "POST",
        body: JSON.stringify({
          name: blueprintName,
        }),
      },
      (result) => {
        // browserHistory.push("/employer/employee/role");
        setCreateBlueprintMessage(
          "New Blueprint Created. Redirecting in 3secs..."
        );
        blueprintNameRef.current.setValue("");

        setTimeout(() => {
          setCreateBlueprintMessage(null);
          setCreateBlueprintError(null);
          closeButtonForCreateModal.current.click();
          history.push("/employer/blueprint/edit/" + result?._id);
        }, 3000);
      },
      () => {
        setCreateBlueprintError(httpState.message || "Invalid Name");
      }
    );
  };

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div
          className={`modal fade ${styles["add-blueprint-modal-id"]}`}
          id={`${styles["add-blueprint-modal-id"]}`}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form className="text-center" onSubmit={createBlueprintHandler}>
                <div className="modal-header">
                  <h5 className="modal-title">Create New Blueprint</h5>
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
                        placeholder="Blueprint Name"
                        ref={blueprintNameRef}
                        required
                      />
                      <small className="form-text text-danger"></small>
                    </div>
                  </div>

                  <br />

                  {createBlueprintError ? (
                    <Result
                      message={createBlueprintError}
                      type="error"
                      format="paragraph"
                    />
                  ) : (
                    ""
                  )}
                  {createBlueprintMessage ? (
                    <Result
                      message={createBlueprintMessage}
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
                        ref={closeButtonForCreateModal}
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

      <div className="row px-2 mt-5  ">
        <div className={`col   col-xl-8  col-md-12    `}>
          <Card className="py-3 px-4">
            <h3>
              Blueprints{" "}
              <Button
                type="button"
                className="btn-warning float-end"
                text="New Blueprint"
                data-bs-toggle="modal"
                data-bs-target={`#${styles["add-blueprint-modal-id"]}`}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </h3>

            <div className="table-responsive">
              <table className="table sched-table table-borderless align-middle">
                <thead className="">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Blueprint Name</th>
                    <th scope="col"></th>
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
                ) : blueprintList.length <= 0 ? (
                  <tbody>
                    <tr className="text-center">
                      <td colSpan="100%">No Data.</td>
                    </tr>
                  </tbody>
                ) : (
                  <React.Fragment>
                    <tbody>
                      {blueprintList.map((value, index) => (
                        <BlueprintRow index={index} element={value} />
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
                                onClick={loadMoreBlueprints}
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

export default Blueprint;
