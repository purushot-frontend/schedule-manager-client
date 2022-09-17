import { createContext, useState } from "react";

const AuthContext = createContext({
  //this dummy object helps for ide suggestions.
  isLoggedIn: false,
  token: "",
  data: {},
  currentCompany: {},

  addLogin: (token, data) => {},
  removeLogin: () => {},
  updateData: (data) => {},
  changeCurrentCompany: (company) => {},
});

export function AuthContextProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  const [currentCompany, setCurrentCompany] = useState({});

  function addLoginHandler(token, data) {
    setData(data);
    setToken(token);

    setIsLoggedIn(true);
    const currentCompany = localStorage.getItem("currentCompany")
      ? JSON.parse(localStorage.getItem("currentCompany"))
      : data.companies[0];
    // const currentCompany = data?.companies[0];
    setCurrentCompany(currentCompany);
    localStorage.setItem(
      "authData",
      JSON.stringify({ isLoggedIn: true, token })
    );
    localStorage.setItem("currentCompany", JSON.stringify(currentCompany));
  }

  function changeCurrentCompanyHandler(company) {
    setCurrentCompany(company);
    localStorage.setItem("currentCompany", JSON.stringify(company));
  }

  function updateDataHandler(data) {
    setData(data);

    localStorage.setItem(
      "authData",
      JSON.stringify({ isLoggedIn: true, token })
    );
  }

  function removeLoginHandler() {
    setIsLoggedIn(false);
    setToken("");
    setData({});
    setCurrentCompany("");
    localStorage.removeItem("authData");
    localStorage.removeItem("currentCompany");
  }

  const context = {
    isLoggedIn: isLoggedIn,
    token: token,
    data: data,
    currentCompany: currentCompany,

    addLogin: addLoginHandler,
    removeLogin: removeLoginHandler,
    updateData: updateDataHandler,
    changeCurrentCompany: changeCurrentCompanyHandler,
  };
  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
