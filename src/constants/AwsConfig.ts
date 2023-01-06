/* eslint-disable  @typescript-eslint/naming-convention */
export const cognitoConfig = {
  aws_cognito_identity_pool_id:
    process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_AWS_CLIENT_ID,
};
/* eslint-disable */
