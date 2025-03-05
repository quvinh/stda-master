import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption, getMultipartAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';

enum Api {
  Config = '/company-config',
}

/**
 * @description: get
 */
export const getConfigApi = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Config,
  };
  return defHttp.get<any>(config);
};

/**
 * @description: post
 */
export const updateConfigApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getMultipartAxiosOption(token),
    url: Api.Config,
    params: params,
  };
  return defHttp.post<any>(config);
};
