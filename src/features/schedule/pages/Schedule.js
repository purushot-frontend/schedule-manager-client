import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./Schedule.module.scss";
import "./react-datepicker.css";
import Card from "../../../components/ui/Card";
import Button from "../../../components/Button";
import useEmployerHttp from "../../employer/hooks/useEmployerHttp";
import Spinner from "../../../components/ui/Spinner";
import Result from "../../../components/ui/Result";
import ScheduleRow from "../modules/ScheduleRow";
import Select from "../../../components/Select";
const Schedule = () => {
  const { isLoading, httpState, sendRequest } = useEmployerHttp();
  const {
    isLoading: loadMoreIsLoading,
    httpState: loadMoreHttpState,
    sendRequest: loadMoreSendRequest,
  } = useEmployerHttp();
  const [scheduleList, setScheduleList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [createScheduleError, setCreateScheduleError] = useState(null);
  const [createScheduleMessage, setCreateScheduleMessage] = useState(null);
  const history = useHistory();
  const closeButtonForCreateModal = useRef();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(moment().startOf("isoweek").utc()),
    endDate: new Date(moment().endOf("week").utc()),
  });
  const { sendRequest: blueprintSendRequest } = useEmployerHttp();
  const [blueprints, setBlueprints] = useState([]);
  const blueprintsRef = useRef();
  useEffect(() => {
    blueprintSendRequest(
      {
        urlPath: "/blueprint?mode=dropdown",
      },
      (result, dispatch) => {
        const tempResult = result.map((value) => {
          return { value: value._id, text: value.name };
        });

        setBlueprints(tempResult);
      },
      () => {}
    );
  }, [blueprintSendRequest]);

  const successMethod = (data, dispatch) => {
    dispatch({
      message: data.message || "success",
      active: true,
      type: "success",
    });

    setScheduleList(data);

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

  const getSchedules = useCallback(() => {
    sendRequest({ urlPath: "/schedule?page=1" }, successMethod, failureMethod);
  }, [sendRequest]);

  useEffect(() => {
    getSchedules();
  }, [getSchedules]);

  const loadMoreSchedules = () => {
    loadMoreSendRequest(
      { urlPath: "/schedule?page=" + (currentPage + 1) },
      (data, dispatch) => {
        if (data.length >= 1) {
          dispatch({
            message: data.message || "success",
            active: true,
            type: "success",
          });

          setScheduleList((prevState) => {
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

  const createScheduleHandler = (event) => {
    event.preventDefault();

    setCreateScheduleError(null);
    setCreateScheduleMessage(null);

    const startDateStr = `${dateRange?.startDate?.getFullYear()}-${(
      "0" +
      (dateRange?.startDate?.getMonth() + 1)
    ).slice(-2)}-${("0" + dateRange?.startDate?.getDate()).slice(-2)}`;

    const endDate = new Date(
      new Date().setDate(dateRange?.startDate?.getDate() + 6)
    );

    const endDateStr = `${endDate?.getFullYear()}-${(
      "0" +
      (endDate?.getMonth() + 1)
    ).slice(-2)}-${("0" + endDate?.getDate()).slice(-2)}`;
    const blueprintId = blueprintsRef.current.getValue();

    sendRequest(
      {
        urlPath: "/schedule",
        method: "POST",
        body: JSON.stringify({
          applyBlueprint: true,
          blueprintId: blueprintId,
          startDate: startDateStr,
          endDate: endDateStr,
        }),
      },
      (result) => {
        // browserHistory.push("/employer/employee/role");
        setCreateScheduleMessage(
          "New ScheduleCreated. Redirecting in 3secs..."
        );

        setTimeout(() => {
          setCreateScheduleMessage(null);
          setCreateScheduleError(null);
          closeButtonForCreateModal.current.click();
          history.push("/employer/schedule/view/" + result?._id);
        }, 3000);
      },
      (error) => {
        setCreateScheduleError(error.message || "Bad Request");
      }
    );
  };

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div
          className={`modal fade ${styles["add-schedule-modal-id"]}`}
          id={`${styles["add-schedule-modal-id"]}`}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form className="text-center" onSubmit={createScheduleHandler}>
                <div className="modal-header">
                  <h5 className="modal-title">Create New Schedule</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row py-2">
                    <label className="text-start">Select Week</label>
                    <div className="form-group col-md-6">
                      <DatePicker
                        selected={new Date(dateRange.startDate)}
                        onChange={(date) =>
                          setDateRange({ ...dateRange, startDate: date })
                        }
                        name="startDate"
                        filterDate={(date) => date.getDay() === 1}
                        placeholderText="Select Week"
                      />
                    </div>
                  </div>
                  <div className="row py-2">
                    <div className="form-group col-md-6">
                      <div className="row">
                        <div className="col-md-12">
                          <Select
                            data={blueprints}
                            id={styles["select-id"]}
                            defaultOption="--- select blueprint---"
                            className="sched-select form-select"
                            ref={blueprintsRef}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {createScheduleError ? (
                    <Result
                      message={createScheduleError}
                      type="error"
                      format="paragraph"
                    />
                  ) : (
                    ""
                  )}
                  {createScheduleMessage ? (
                    <Result
                      message={createScheduleMessage}
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

      <div className="row px-2 mt-5 ">
        <div className={`col   col-xl-8  col-md-12   `}>
          <Card className="py-3 px-4">
            <h3>
              Schedules
              <Button
                type="button"
                className="btn-warning float-end"
                text="New Schedule"
                data-bs-toggle="modal"
                data-bs-target={`#${styles["add-schedule-modal-id"]}`}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </h3>
            <div className="table-responsive">
              <table className="table sched-table table-borderless align-middle">
                <thead className="">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Schedule Week</th>
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
                ) : scheduleList.length <= 0 ? (
                  <tbody>
                    <tr className="text-center">
                      <td colSpan="100%">No Data.</td>
                    </tr>
                  </tbody>
                ) : (
                  <React.Fragment>
                    <tbody>
                      {scheduleList.map((value, index) => (
                        <ScheduleRow index={index} element={value} />
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
                                onClick={loadMoreSchedules}
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

export default Schedule;
