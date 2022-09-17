const Result = (props) => {
  const { message, type, format } = props;
  let output = "<p>error</p>";

  if (format === "table") {
    const textColor = type === "success" ? "success" : "danger";
    output = (
      <tr>
        <td colSpan="100%">
          <p className={`text-${textColor} text-center`}>
            {message || `No Info`}
          </p>
        </td>
      </tr>
    );
  } else if (format === "paragraph") {
    const textColor = type === "success" ? "success" : "danger";
    output = (
      <p className={`text-${textColor} text-center`}>{message || `No Info`}</p>
    );
  } else {
    output = <p>bad request</p>;
  }

  return output;
};

export default Result;
