import React, { useRef, useImperativeHandle } from "react";

const Select = React.forwardRef((props, ref) => {
  const selectRef = useRef();
  const currentValue = () => {
    return document.getElementById(selectRef.current.id).value;
  };
  const activate = () => {
    selectRef.current.focus();
  };

  useImperativeHandle(ref, () => {
    return {
      getValue: currentValue,
      focus: activate,
    };
  });

  const getDefault = () => {
    if (props.selected) {
      return (
        <option value={props.selected?.value}>{props.selected?.name}</option>
      );
    } else {
      return <option value="">{props.defaultOption}</option>;
    }
  };

  return (
    <React.Fragment>
      <select
        ref={selectRef}
        className={props.className}
        id={props.id}
        required={props?.required}
      >
        {getDefault()}
        {props.data.map((element) => (
          <option
            key={element.value || element}
            value={element.value || element}
          >
            {element.text || element}
          </option>
        ))}
      </select>
    </React.Fragment>
  );
});

export default Select;
