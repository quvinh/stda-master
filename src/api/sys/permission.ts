import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';

enum Api {
  Permissions = '/permissions',
  Permission = '/permissions/{id}',
}

/**
 * @description: search
 */
export const searchPermissionApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Permissions,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createPermissionApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Permissions,
    params: payload,
  };
  return defHttp.post<any | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updatePermissionApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Permission.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<any>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deletePermissionApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Permission.replace('{id}', String(id)),
  };
  return defHttp.delete<any>(config, { errorMessageMode: mode });
};
