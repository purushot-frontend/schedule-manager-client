const Button = (props) => {
  const clickHandler = () => {
    props.onClick();
  };

  let extraProps = {};

  if (props["data-bs-toggle"]) {
    extraProps["data-bs-toggle"] = props["data-bs-toggle"];
  }
  if (props["data-bs-target"]) {
    extraProps["data-bs-target"] = props["data-bs-target"];
  }

  return (
    <button
      type={props?.type}
      onClick={props.onClick ? clickHandler : () => {}}
      className={`btn ${props.className}`}
      disabled={props?.disabled === "true" ? "true" : ""}
      {...extraProps}
    >
      {props.children}
      {` ${props.text ? props.text : ""}`}
    </button>
  );
};

export default Button;
