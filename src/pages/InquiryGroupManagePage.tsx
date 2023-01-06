import {
  Container,
  Header,
  Card,
  Search,
  SearchProps,
  SearchResultData,
  Button
} from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { fetchInqiryGroup,fetchInstitutions,fetchInstitution } from "../repositories/instGroup";
import { InquiryGroup } from "../types/inquiryGroup";
import { Institution } from "../types/institution";
import {RoutePaths} from "../constants/RoutePaths";
import { Link } from "react-router-dom";
  

type Result = {
  title: string;
  description: string;
  id: string;
};

  export const InquiryGroupManagePage = () => {

    const search = useLocation().search;
    const [group, setGroup] = useState<InquiryGroup>()
    const [institutions, setInstitutions] = useState<Array<Institution>>([])
    const [candidates, setCandidates] = useState<Array<Result>>([])

    useEffect(() => {
      const query = new URLSearchParams(search);
      const id = query.get('id')
      if(id){
        let group = fetchInqiryGroup({groupId:id})
        console.log(group)
        setGroup(group)
        setInstitutions(group?.institutions||[])
      }

    },[search])

    const searchCandidates = useCallback((_, props: SearchProps) =>{
      let insts = fetchInstitutions(props.value || "")
      const results: Array<Result> = [...Array(insts.length)].map((_, i) => {
        return {
          title: insts[i].name || "",
          description: insts[i].tel || "",
          id:  insts[i].institutionId || "",
        };
      });
      setCandidates(results);
    },[institutions])

    const onSelect = useCallback((_, data: SearchResultData)=>{
      let inst = fetchInstitution(data.result.id)
      if(inst){
        setInstitutions([...institutions,inst])
      }
 
    },[institutions])

    const onDelete = useCallback((id) => {
      let result = institutions.filter(inst => inst.institutionId !== id);
      setInstitutions(result)
    },[institutions])


    return (
      <Container>
        <Link to={RoutePaths.HOME}>Home</Link>
        <Header as="h1" style={{ marginTop: "50px" }}>
          {group?.name} (管理)
        </Header>

        <Search
          results={candidates}
          placeholder={"Search..."}
          onSearchChange={searchCandidates}
          onResultSelect={onSelect}
        />

        {institutions && institutions.map((inst) => { 
   
            return (
              <Card >
                <Card.Content>
                  <Card.Header>
                    {inst.name}
                  </Card.Header>
                  <Card.Meta>
                    {inst.tel}
                  </Card.Meta>
                  <Button onClick={()=>onDelete(inst.institutionId)}>削除</Button>
                </Card.Content>
              </Card>
        )})}
          
      </Container>
    );
  };
  