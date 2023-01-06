import {Institution} from "./institution"

export type InquiryGroup = {
    groupId: string;
    name: string;
    institutions: Institution[];
  };
