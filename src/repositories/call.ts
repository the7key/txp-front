import {
    CallApiFactory,
    CreateCallRequest,
} from "../generated";
import { createConfig } from "./config";
  

export const createCall = async (id:string, data: CreateCallRequest) => {
    const config = await createConfig();
    const res = await CallApiFactory(config).createCall(id,data);
    return res;
};