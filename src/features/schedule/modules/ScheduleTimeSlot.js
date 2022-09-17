import React, { useState } from "react";

import useEmployerHttp from "../../employer/hooks/useEmployerHttp";
import Spinner from "../../../components/ui/Spinner";
import styles from "./ScheduleTimeSlot.module.scss";
function ScheduleTimeSlot({ scheduleId, timeSlot }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const { isLoading, sendRequest } = useEmployerHttp();
  const deleteTimeSlot = () => {
    sendRequest(
      {
        urlPath: `/schedule/${scheduleId}/timeSlot/${timeSlot._id}`,
        method: "DELETE",
      },
      () => {
        setIsDeleted(true);
      },
      () => {
        window.location.reload();
      }
    );
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <React.Fragment>
          <span className={`badge bg-light text-dark mx-1 my-1`}>
            <Spinner />
          </span>
          <br />
        </React.Fragment>
      ) : isDeleted ? (
        ""
      ) : (
        <React.Fragment>
          <span
            className={`badge bg-light text-dark mx-1 my-1 ${styles["content"]}`}
            onClick={deleteTimeSlot}
          >
            <span>
              {`${timeSlot?.employee?.name}`}
              <br />
              <br />
              {`${timeSlot?.startTime
                .split("T")[1]
                .replace(":00.000Z", "")} - ${timeSlot?.endTime
                .split("T")[1]
                .replace(":00.000Z", "")}`}
            </span>
          </span>
          <br />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default ScheduleTimeSlot;
