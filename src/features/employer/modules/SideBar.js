import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./SideBar.module.scss";
import SideBarMenu from "./SideBarMenu";
const SideBar = () => {
  const [toggle, setToggle] = useState(true);
  const toggleBar = () => {
    // setToggle((prevState) => {
    //   return !prevState;
    // });
    setToggle(!toggle);
  };
  return (
    <div
      className={`
      ${!toggle ? styles.dynamicWidth : styles["dynamicWidth--alt"]}
sched-sidebar     
flex-column
align-items-center align-items-sm-start
pt-2
text-white
min-vh-100
h-100
`}
    >
      <div className="sidebar-toggle">
        <button
          onClick={toggleBar}
          aria-label="Side Bar Toggle Button"
          type="button"
          className="btn btn-warning"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      {!toggle && <SideBarMenu />}
    </div>
  );
};

export default SideBar;
