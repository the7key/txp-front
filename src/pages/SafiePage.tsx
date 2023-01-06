import {
    Container,
    Header,
  } from "semantic-ui-react";
  import { Link } from "react-router-dom";
  import { RoutePaths } from "../constants/RoutePaths";
  
  export const SafiePage = () => {
  
    return (
      <Container>
        <Link to={RoutePaths.HOME}>Home</Link>
        <Header as="h1" style={{ marginTop: "50px" }}>
          Streamデモ
        </Header>
      </Container>
    );
  };
  