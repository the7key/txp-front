import {
    InstGroupApiFactory,
    CreateInstGroupRequest,
    InstGroup
} from "../generated";
import { createConfig } from "./config";
import { InquiryGroup } from "./../types/inquiryGroup";
import { Institution } from "./../types/institution";
  
export const fetchInstGroups = async (
    page?: number | undefined,
    size?: number | undefined,
    sort?: string | undefined,
    name?: string | undefined
) => {
    const config = await createConfig();
    return InstGroupApiFactory(config).getInstGroups();
};

export const fetchInstGroup = async (instGroupId: InstGroup["id"]) => {
    const config = await createConfig();
    const res = await InstGroupApiFactory(config).getInstGroup(instGroupId);
    return res;
  };



let institutionA : Institution = {
    institutionId: "institution1",
    name: "病院A",
    tel: "000-0000-0000",
    address: "住所A",
}

let institutionB : Institution = {
    institutionId: "institution2",
    name: "病院B",
    tel: "000-0000-0000",
    address: "住所B",
}

let institutionC : Institution = {
    institutionId: "institution3",
    name: "病院C",
    tel: "000-0000-0000",
    address: "住所C",
}

let institutionD : Institution = {
    institutionId: "institution4",
    name: "病院D",
    tel: "000-0000-0000",
    address: "住所D",
}

let institutionE : Institution = {
    institutionId: "institution5",
    name: "病院E",
    tel: "000-0000-0000",
    address: "住所E",
}

let institutionF : Institution = {
    institutionId: "institution6",
    name: "病院F",
    tel: "000-0000-0000",
    address: "住所F",
}

let institutionG : Institution = {
    institutionId: "institution7",
    name: "病院G",
    tel: "000-0000-0000",
    address: "住所G",
}

let institutionH : Institution = {
    institutionId: "institution8",
    name: "病院H",
    tel: "000-0000-0000",
    address: "住所H",
}

let allInsts = [institutionA,institutionB,institutionC,institutionD,institutionF,institutionG,institutionH]


let groups :Array<InquiryGroup> = [
    {
        groupId:"group1",
        name:"外傷",
        institutions:[institutionA,institutionB]
    },{
        groupId:"group2",
        name:"脳卒中",
        institutions:[institutionA,institutionB,institutionC,institutionD,institutionE,institutionF,institutionG,institutionH]
    },{
        groupId:"group3",
        name:"北部地域",
        institutions:[institutionA,institutionB,institutionC,institutionG,institutionH]
    },{
        groupId:"group4",
        name:"南部地域",
        institutions:[]
    }
]

export type FetchInqiryGroupParams = {
    groupId: string
}

export const fetchInqiryGroup = (params:FetchInqiryGroupParams) => {
    const {groupId} = params
    let group  = groups.find(element => element["groupId"] == groupId);
    return group
}

export type FetchGroupInstitutions = {
    groupId: string
}

export const fetchInstitutions = (pattern:string) => {
  let results = allInsts.filter(inst => inst.name.indexOf(pattern) > -1);
  return results
}

export const fetchInstitution = (instId:string) => {
    let inst  = allInsts.find(inst => inst["institutionId"] == instId);
    return inst
  }