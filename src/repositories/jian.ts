import {
    JianApiFactory,
    CreateJianRequest,
} from "../generated";
import { createConfig } from "./config";
  
export const fetchJians = async (
    page?: number | undefined,
    size?: number | undefined,
    sort?: string | undefined,
    name?: string | undefined
) => {
    const config = await createConfig();
    const res = await JianApiFactory(config).getJians();
    return res;
};
  
export const createJian = async (data: CreateJianRequest) => {
    const config = await createConfig();
    const res = await JianApiFactory(config).createJian(data);
    return res;
};