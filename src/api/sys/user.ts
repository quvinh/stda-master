import { defHttp } from '@/utils/http/axios';
import { LoginParams, LoginResultModel } from './model/userModel';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { getDefaultAxiosOption, getMultipartAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/profile',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  user = '/users/{id}',
  users = '/users',
  register = '/register',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.GetUserInfo,
  };
  return defHttp.get<any>(config, { errorMessageMode: 'none' });
}

export function searchApi(params: any) {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.users,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Logout,
  };
  return defHttp.post(config);
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

export const updateUserInfoApi = (params: any = {}) => {
  params._method = 'PUT';
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getMultipartAxiosOption(token),
    url: Api.user.replace('{id}', String(params.id)),
    params,
  };
  return defHttp.post<any>(config);
};

export const createApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.register,
    params: payload,
  };
  return defHttp.post<any>(config, { errorMessageMode: mode });
};

export const deleteApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.user.replace('{id}', String(id)),
  };
  return defHttp.delete<any>(config, { errorMessageMode: mode });
};
