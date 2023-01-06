import { ReactNode } from "react";
import { Route, RouteProps } from "react-router-dom";

export const PrivateRoute = ({
  children,
  ...rest
}: {
  children: ReactNode;
} & RouteProps) => {
  return <Route {...rest} render={() => children} />;
};
