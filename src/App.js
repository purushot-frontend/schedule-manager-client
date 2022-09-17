import React, { useEffect, useContext, useState, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Placeholder from "react-bootstrap/Placeholder";
import GeneralLayout from "./modules/GeneralLayout";

import AboutUs from "./pages/About";
import Contact from "./pages/Contact";
import EmployerIndex from "./features/employer/router/EmployerIndex";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Index from "./pages/Index";
import Register from "./features/employer/pages/Register";

import Verify from "./features/employer/pages/Verify";
import AuthContext from "./store/authcontext";
import backendURL from "./constants/config";
import Spinner from "./components/ui/Spinner";

// const GeneralLayout = React.lazy(() => import("./modules/GeneralLayout"));
// const AboutUs = React.lazy(() => import("./pages/About"));
// const Contact = React.lazy(() => import("./pages/Contact"));
// const EmployerIndex = React.lazy(() =>
//   import("./features/employer/router/EmployerIndex")
// );
// const ForgotPassword = React.lazy(() => import("./pages/ResetPassword"));
// const Index = React.lazy(() => import("./pages/Index"));
// const Register = React.lazy(() => import("./features/employer/pages/Register"));

// const Verify = React.lazy(() => import("./features/employer/pages/Verify"));
// const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));

function App() {
  const [isLoading, SetIsLoading] = useState(true);

  //let { paths, url } = useRouteMatch();
  const authCtx = useContext(AuthContext);
  // const history = useHistory();

  useEffect(() => {
    //retrieving authData from localstorage if any.

    const fetchUserData = async () => {
      if (localStorage.getItem("authData")) {
        const authData = JSON.parse(localStorage.getItem("authData"));
        if (authData.isLoggedIn) {
          const response = await fetch(backendURL + "/api/v1/user/me", {
            method: "GET",

            headers: { Authorization: `Bearer ${authData.token}` },
          });

          const result = await response.json();

          if (result.status !== "success") {
            authCtx.removeLogin();
            window.location.reload();
            return;
          }

          authCtx.addLogin(authData.token, result.data);

          SetIsLoading(false);
          //history.push("/employer/companies");
        }
      } else {
        SetIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
  return isLoading ? (
    <div className="sched-container-spinner">
      <p>Loading...</p>
      <Spinner />
    </div>
  ) : (
    <React.Fragment>
      <Switch>
        <Route path="/" exact={true}>
          <GeneralLayout>
            <Index />
          </GeneralLayout>
        </Route>

        <Route path="/register">
          <GeneralLayout>
            <Register />
          </GeneralLayout>
        </Route>
        <Route path="/forgotPassword">
          <GeneralLayout>
            <ForgotPassword />
          </GeneralLayout>
        </Route>
        <Route path="/resetPassword">
          <GeneralLayout>
            <ResetPassword />
          </GeneralLayout>
        </Route>

        <Route path="/aboutus">
          <GeneralLayout>
            {" "}
            <AboutUs />
          </GeneralLayout>
        </Route>

        <Route path="/contactus">
          <GeneralLayout>
            {" "}
            <Contact />
          </GeneralLayout>
        </Route>

        {authCtx.isLoggedIn && (
          <Route path="/employer">
            <GeneralLayout>
              <EmployerIndex />
            </GeneralLayout>
          </Route>
        )}

        <Route path="/favorites">
          <GeneralLayout>
            <div>fav page</div>
          </GeneralLayout>
        </Route>
        <Route path="/verifyAccount">
          <Verify />
        </Route>

        <Route path="*">
          <GeneralLayout>
            <Index />
          </GeneralLayout>
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
