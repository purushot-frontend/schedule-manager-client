import { useState, useCallback, useReducer, useContext } from "react";
import backendURL from "../../../constants/config";
import AuthContext from "../../../store/authcontext";
const httpInitialState = { message: "", active: false, type: "" };

const httpStateReducer = (state, action) => {
  switch (action.type) {
    case "error":
      return {
        message: action.message,
        active: true,
        type: "error",
      };
    case "success":
      return { message: action.message, active: true, type: "success" };

    default:
      return { ...httpInitialState };
  }
};
const useEmployerHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [httpState, dispatchHttpState] = useReducer(
    httpStateReducer,
    httpInitialState
  );
  const authCtx = useContext(AuthContext);

  const sendRequest = useCallback(
    async (requestConfig, successMethod, failureMethod) => {
      setIsLoading(true);

      const response = await fetch(
        backendURL + "/api/v1/module" + requestConfig.urlPath,
        {
          method: requestConfig.method ? requestConfig.method : "GET",
          body: requestConfig.body ? requestConfig.body : null,
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
            "Content-type": "application/json",
            company: authCtx.currentCompany._id,
          },
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        successMethod(result.data, dispatchHttpState);
      } else {
        failureMethod(result, dispatchHttpState);
      }
      setIsLoading(false);
    },
    [authCtx.token, authCtx.currentCompany._id]
  );

  return { isLoading, sendRequest, httpState };
};

export default useEmployerHttp;
