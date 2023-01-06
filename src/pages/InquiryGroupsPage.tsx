import {
  Container,
  Header,
  Card,
} from "semantic-ui-react";
import {useState,useEffect,useCallback} from "react";
import {fetchInstGroups} from "../repositories/instGroup";
import {RoutePaths} from "../constants/RoutePaths";
import { useHistory,Link } from "react-router-dom";
import {InstGroup} from "../generated"

  
  export const InquiryGroupsPage = () => {
  
    const [groups, setGroups] = useState<InstGroup[]>();
    const history = useHistory();
    const toGroupPage = useCallback((id) => {
        history.push(RoutePaths.INQUIRY_GROUP + "?id="+id);
      },[history]);


    useEffect(() => {
      fetchInstGroups().then((res) => {
        console.log(res)
        // @ts-ignore
        setGroups(res.data || [])
      })
    }, []);

    return (
      <Container>
        <Link to={RoutePaths.HOME}>Home</Link>
        <Header as="h1" style={{ marginTop: "50px" }}>
          照会グループ
        </Header>
        {
          groups && groups.map((group) => {
            return (
            <Card onClick={() => toGroupPage(group.id)} key={group.id}>
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