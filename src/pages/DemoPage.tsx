import {
    Container,
    Header,
    Button,
  } from "semantic-ui-react";
  import { useHistory } from "react-router-dom";
  import {useCallback} from "react";
  import { RoutePaths } from "../constants/RoutePaths";
  
  export const DemoPage = () => {

    const history = useHistory();
    const toGroupsPage = useCallback(() => {
        history.push(RoutePaths.INQUIRY_GROUPS);
      },[history]);

      const toGroupsManagePage = useCallback(() => {
        history.push(RoutePaths.INQUIRY_GROUPS_MANAGE);
      },[history]);

      const toPdfPage = useCallback(() => {
        history.push(RoutePaths.PDF);
      },[history]);


      const toSafiePage = useCallback(() => {
        history.push(RoutePaths.SAFIE);
      },[history]);
  
    return (
      <Container>
        <Header as="h1" style={{ marginTop: "50px" }}>
          デモ
        </Header>
        <Button onClick={toGroupsPage}>照会グループ</Button>
        <Button onClick={toGroupsManagePage}>照会グループ管理</Button>
        <Button onClick={toPdfPage}>PDF</Button>
        <Button onClick={toSafiePage}>STREAM</Button>
      </Container>
    );
  };
  