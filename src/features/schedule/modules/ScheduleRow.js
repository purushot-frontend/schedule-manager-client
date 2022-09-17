import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./../../../components/Button";

import Spinner from "../../../components/ui/Spinner";

function ScheduleRow(props) {
  const [dataLoaded, setDataLoaded] = useState(false);

  const [data, setData] = useState({});

  useEffect(() => {
    setData({ index: props.index, ...props.element });

    setDataLoaded(true);
  }, [props]);

  return (
    <React.Fragment>
      {!dataLoaded ? (
        <tr>
          <td colspan="100%" className=" text-center">
            <Spinner />
          </td>
        </tr>
      ) : (
        <tr>
          <td>{data.index + 1}</td>
          <td>{data.startDate}</td>

          <td>
            <Link to={`/employer/schedule/view/${data._id}`}>
              <Button
                type="button"
                aria-label="View More"
                className="btn-warning float-end"
              >
                <FontAwesomeIcon icon={faEye} />
              </Button>
            </Link>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default ScheduleRow;
