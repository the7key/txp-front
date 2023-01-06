import { AxiosError, AxiosResponse } from "axios";
import { SWRConfiguration, SWRResponse } from "swr";
import { SWRInfiniteConfiguration, SWRInfiniteResponse } from "swr/infinite";

export type FetchHookReturnValue<ResponseData> = SWRResponse<
  AxiosResponse<ResponseData>,
  AxiosError
>;

export type FetchHookSWROptions<ResponseData> = SWRConfiguration<
  AxiosResponse<ResponseData>
>;

export type FetchHookMutate<ResponseData> = SWRResponse<
  AxiosResponse<ResponseData>,
  AxiosError
>["mutate"];

export type FetchHookSWRInfiniteOptions<ResponseData> =
  SWRInfiniteConfiguration<AxiosResponse<ResponseData>>;

export type FetchHookSWRInfiniteReturnValue<ResponseData> = SWRInfiniteResponse<
  AxiosResponse<ResponseData>,
  AxiosError
>;
