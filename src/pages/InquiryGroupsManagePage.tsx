import {
  Container,
  Header,
  Card,
  Button
} from "semantic-ui-react";
import {useState,useEffect,useCallback} from "react";
import {fetchInstGroups} from "../repositories/instGroup";
import { InquiryGroup } from "../types/inquiryGroup";
import {RoutePaths} from "../constants/RoutePaths";
import { useHistory,Link } from "react-router-dom";

  
  export const InquiryGroupsManagePage = () => {
  
    const [groups, setGroups] = useState<InquiryGroup[]>();
    const history = useHistory();
    const toGroupPage = useCallback((id) => {
        history.push(RoutePaths.INQUIRY_GROUP_MANAGE + "?id="+id);
      },[history]);


    useEffect(() => {
      (async () => {
        const data = await fetchInstGroups()
        setGroups([])
      })()

    }, []);

    return (
      <Container>
        <Link to={RoutePaths.HOME}>Home</Link>
        <Header as="h1" style={{ marginTop: "50px" }}>
          照会グループ管理
        </Header>
        <Button color="orange">追加</Button>
        {
          groups && groups.map((group) => {
            return (
            <Card onClick={() => toGroupPage(group.groupId)}>
              <Card.Content>
                <Card.Meta>
                  <span>{group.name}</span>
                </Card.Meta>
              </Card.Content>
            </Card>
            )
          })
        }
      </Container>
    );
  };