import { Configuration } from "../generated";

export const createConfig = async () => {
  const baseUrl = await process.env.LOCAL_API_BASE_URL;

  const config = new Configuration({
    basePath: baseUrl,
    baseOptions: {
      withCredentials: true,
    },
  });
  return config;
};
