import {
  Container,
  Header,
  Card,
  Button,
  Dimmer, 
  Loader
} from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import styles from "./InquiryGroup.module.scss";
import { Link } from "react-router-dom";
import {RoutePaths} from "../constants/RoutePaths";
import {fetchInstGroup} from "../repositories/instGroup";
import {createCall} from "../repositories/call";
import {InstGroup, Inst, PhoneNo} from "../generated";

  
type InstParams = Inst & {
  isActive?: boolean
}

  export const InquiryGroupPage = () => {

    const search = useLocation().search;
    const [group, setGroup] = useState<InstGroup>()
    const [selectedInsts, setSelectedInsts] = useState<Array<InstParams>>([])
    const [isAllActive, setIsAllActive] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
      const query = new URLSearchParams(search);
      const id = query.get('id')
      if(id){
        fetchInstGroup(id).then((res)=>{
          setGroup(res.data)
          setSelectedInsts(res.data.instGroupMembers||[])
        })

        
      }
    },[search])

    const changeIsActive = useCallback((id) => {

      setSelectedInsts((selectedInsts) =>
      selectedInsts?.map((inst) => (inst.id==id ? {...inst, isActive:!inst.isActive} : inst))
      );

    },[selectedInsts])

    const allSelect = useCallback(() => {
    
      setSelectedInsts((selectedInsts) =>
      selectedInsts?.map((inst) => ({...inst, isActive: true})
      ))

    },[selectedInsts])

    const allDeselect = useCallback(() => {
    
      setSelectedInsts((selectedInsts) =>
      selectedInsts?.map((inst) => ({...inst, isActive: false})
      ))

    },[selectedInsts])


    useEffect(() => {
      const compareIsNotActive = (inst:InstParams) => {
        return !inst.isActive
      }
      
      if(selectedInsts.find(compareIsNotActive)){
        setIsAllActive(false)
      }else{
        setIsAllActive(true)
      }
    },[selectedInsts])

    const onCall = useCallback(() => {

      let phones:Array<PhoneNo> = []
      selectedInsts.map(inst => { 
        if(inst.isActive && inst.phoneNo){
          phones.push({phoneNo:inst.phoneNo})
        }
      });

      if (phones.length==0){return}
      setLoading(true)
      createCall(
        "jianid",
        {
          name:"callfromfrontapp", 
          description:"call from front app", 
          phoneNos:phones
        }
      ).then((res) => {
        console.log(res)
      }).finally(() => {
        setLoading(false)
      })
      
    },[selectedInsts])


    return (
      <Container>
        <Link to={RoutePaths.HOME}>Home</Link>
        <Header as="h1" style={{ marginTop: "50px" }}>
          {group?.name}
        </Header>

        {isAllActive ? ( <Button onClick={allDeselect}>全選択解除</Button>):(<Button onClick={allSelect}>全選択</Button>) }
        <Button color="orange" onClick={onCall}>照会開始</Button>


        {selectedInsts && selectedInsts.map((inst) => { 
   
          if(inst.isActive){
            return (
              <Card onClick={() => changeIsActive(inst.id)} className={styles.isActive} key={inst.id}>
                <Card.Content>
                  <Card.Header>
                    {inst.name}
                  </Card.Header>
                  <Card.Meta>
                    {inst.phoneNo}
                  </Card.Meta>
                </Card.Content>
              </Card>
            )
          
          }else{
            return (
              <Card onClick={() => changeIsActive(inst.id)} key={inst.id}>
                <Card.Content>
                  <Card.Header>
                    {inst.name}
                  </Card.Header>
                  <Card.Meta>
                    {inst.phoneNo}
                  </Card.Meta>
                </Card.Content>
              </Card>
          )
        }})}

        <Dimmer active={loading}>
            <Loader active>Loading...</Loader>
        </Dimmer>
          
      </Container>
    );
  };
  