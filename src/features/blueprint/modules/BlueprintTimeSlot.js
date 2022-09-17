import React, { useState } from "react";

import useEmployerHttp from "../../employer/hooks/useEmployerHttp";
import Spinner from "./../../../components/ui/Spinner";
import styles from "./BlueprintTimeSlot.module.scss";
function BlueprintTimeSlot({ blueprintId, timeSlot, roleData }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const { isLoading, sendRequest } = useEmployerHttp();
  const deleteTimeSlot = () => {
    sendRequest(
      {
        urlPath: `/blueprint/${blueprintId}/timeSlot/${timeSlot._id}`,
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
              {`(${timeSlot.requiredEmployees}) ${roleData.text}`}
              <br />
              <br />
              {`${timeSlot.startTime} - ${timeSlot.endTime}`}
            </span>
          </span>
          <br />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default BlueprintTimeSlot;
