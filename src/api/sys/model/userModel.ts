/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  layout?: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  access_token: string;
  token_type: string;
  user: any;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  userId: string | number;
  name: string;
  username: string;
  avatar: string;
  desc?: string;
}
