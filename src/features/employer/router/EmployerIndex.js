import React, { /*useContext,*/ useEffect, Suspense } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import {
  Route,
  Switch,
  useRouteMatch /* useHistory */,
} from "react-router-dom";
//import SideBar from "../modules/SideBar";
//import EmployerLayout from "../modules/EmployerLayout";
import MyAccount from "../pages/MyAccount";
import Companies from "../pages/Companies";
import Role from "../../employee/pages/Role";
import Employee from "../../employee/pages/Employee";
import Blueprint from "../../blueprint/pages/Blueprint";
import BlueprintEdit from "../../blueprint/pages/BlueprintEdit";
import Schedule from "../../schedule/pages/Schedule";
import ScheduleEdit from "../../schedule/pages/ScheduleEdit";
import Spinner from "../../../components/ui/Spinner";
//import AuthContext from "../../../store/authcontext";
const EmployerLayout = React.lazy(() => import("../modules/EmployerLayout"));

const EmployerIndex = () => {
  // const history = useHistory();
  let { path /*url*/ } = useRouteMatch();
  //const authCtx = useContext(AuthContext);

  useEffect(() => {}, []);
  return (
    <Suspense
      fallback={
        <Placeholder
          as="p"
          animation="wave"
          style={{ height: "100vh" }}
          xs={12}
          bg="dark"
        />
      }
    >
      <EmployerLayout>
        <Switch>
          <Route path={path} exact={true}>
            <Suspense
              fallback={
                <Placeholder
                  as="p"
                  animation="wave"
                  style={{ height: "100vh" }}
                  xs={12}
                  bg="dark"
                />
              }
            >
              <MyAccount />
            </Suspense>
          </Route>
          <Route path={`${path}/companies`}>
            <Suspense
              fallback={
                <Placeholder
                  as="p"
                  animation="wave"
                  style={{ height: "100vh" }}
                  xs={12}
                  bg="dark"
                />
              }
            >
              <Companies />
            </Suspense>
          </Route>
          <Route path={`${path}/fav`}>
            <div>fav page</div>
          </Route>
          <Route path={`${path}/employee/role/`}>
            <Suspense
              fallback={
                <Placeholder
                  as="p"
                  animation="wave"
                  style={{ height: "100vh" }}
                  xs={12}
                  bg="dark"
                />
              }
            >
              <Role />
            </Suspense>
          </Route>
          <Route path={`${path}/blueprint/edit/:blueprintId`}>
            <Suspense
              fallback={
                <Placeholder
                  as="p"
                  animation="wave"
                  style={{ height: "100vh" }}
                  xs={12}
                  bg="dark"
                />
              }
            >
              <BlueprintEdit />
            </Suspense>
          </Route>
          <Route path={`${path}/blueprint/`}>
            <Suspense
              fallback={
                <Placeholder
                  as="p"
                  animation="wave"
                  style={{ height: "100vh" }}
                  xs={12}
                  bg="dark"
                />
              }
            >
              <Blueprint />
            </Suspense>
          </Route>
          <Route path={`${path}/schedule/view/:scheduleId`}>
            <Suspense
              fallback={
                <Placeholder
                  as="p"
                  animation="wave"
                  style={{ height: "100vh" }}
                  xs={12}
                  bg="dark"
                />
              }
            >
              <ScheduleEdit />
            </Suspense>
          </Route>
          <Route path={`${path}/schedule/`}>
            <Suspense
              fallback={
                <Placeholder
                  as="p"
                  animation="wave"
                  style={{ height: "100vh" }}
                  xs={12}
                  bg="dark"
                />
              }
            >
              <Schedule />
            </Suspense>
          </Route>

          <Route path={`${path}/employee/`}>
            <Suspense
              fallback={
                <Placeholder
                  as="p"
                  animation="wave"
                  style={{ height: "100vh" }}
                  xs={12}
                  bg="dark"
                />
              }
            >
              <Employee />
            </Suspense>
          </Route>
        </Switch>
      </EmployerLayout>
    </Suspense>
  );
};

export default EmployerIndex;
