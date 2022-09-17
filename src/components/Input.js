import React, { useRef, useImperativeHandle } from "react";
const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  const activate = () => {
    inputRef.current.focus();
  };
  const currentValue = () => {
    return inputRef.current.value;
  };
  const setValue = (val) => {
    inputRef.current.value = val;
  };

  useImperativeHandle(ref, () => {
    return {
      getValue: currentValue,
      focus: activate,
      setValue: setValue,
    };
  });
  return (
    <input
      ref={inputRef}
      type={props.type}
      className={props.className}
      placeholder={props.placeholder}
      required={props?.required}
      defaultValue={props.value ? props.value : ""}
    />
  );
});

export default Input;
