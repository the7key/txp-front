import { Route, Switch } from "react-router-dom";
import { PrivateRoute } from "./components/router/PrivateRoute";
import { ToastPortal } from "./components/toast/ToastPortal";
import { RoutePaths } from "./constants/RoutePaths";
import { ToastProvider } from "./hooks/contexts/ToastContext";
import {DemoPage} from "./pages/DemoPage";
import {InquiryGroupManagePage} from "./pages/InquiryGroupManagePage";
import {InquiryGroupsManagePage} from "./pages/InquiryGroupsManagePage";
import {InquiryGroupPage} from "./pages/InquiryGroupPage";
import {InquiryGroupsPage} from "./pages/InquiryGroupsPage";
import {PdfPage} from "./pages/PdfPage";
import {SafiePage} from "./pages/SafiePage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <ToastProvider>
          <Switch>
            <PrivateRoute exact path={RoutePaths.HOME}>
              <DemoPage />
            </PrivateRoute>
            <PrivateRoute exact path={RoutePaths.INQUIRY_GROUP_MANAGE}>
              <InquiryGroupManagePage />
            </PrivateRoute>
            <PrivateRoute exact path={RoutePaths.INQUIRY_GROUPS_MANAGE}>
              <InquiryGroupsManagePage />
            </PrivateRoute>
            <PrivateRoute exact path={RoutePaths.INQUIRY_GROUP}>
              <InquiryGroupPage />
            </PrivateRoute>
            <PrivateRoute exact path={RoutePaths.INQUIRY_GROUPS}>
              <InquiryGroupsPage />
            </PrivateRoute>
            <PrivateRoute exact path={RoutePaths.PDF}>
              <PdfPage />
            </PrivateRoute>
            <PrivateRoute exact path={RoutePaths.SAFIE}>
              <SafiePage />
            </PrivateRoute>
            <Route>
              <NotFoundPage />
            </Route>
          </Switch>
          <ToastPortal />
      </ToastProvider>
    </>
  );
}

export default App;
