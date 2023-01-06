import { Link } from "react-router-dom";
import { Container, Header } from "semantic-ui-react";
import { RoutePaths } from "../constants/RoutePaths";

export const NotFoundPage = () => {
  return (
    <Container>
      <Header as={"h3"}> NotFound</Header>
      <div>
        <Link to={RoutePaths.HOME}>トップに戻る</Link>
      </div>
    </Container>
  );
};
