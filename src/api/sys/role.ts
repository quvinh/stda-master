import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';

enum Api {
  Roles = '/roles',
  Role = '/roles/{id}',
}

/**
 * @description: search
 */
export const searchRoleApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Roles,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createRoleApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Roles,
    params: payload,
  };
  return defHttp.post<any | any>(config, { errorMessageMode: mode });
};

export const updateRoleApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Role.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<any | any>(config, { errorMessageMode: mode });
};

export const deleteRoleApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Role.replace('{id}', String(id)),
  };
  return defHttp.delete<any>(config, { errorMessageMode: mode });
};
