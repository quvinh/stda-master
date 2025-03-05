import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IProcess } from '../model/IProcess';

enum Api {
  Processes = '/processes',
  ProcessesId = '/processes/{id}',
}

/**
 * @description: search
 */
export const searchProcessApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Processes,
    params: params,
  };
  return defHttp.get<IProcess>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createProcessApi = (payload: IProcess, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Processes,
    params: payload,
  };
  return defHttp.post<IProcess | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateProcessApi = (payload: IProcess, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProcessesId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IProcess>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteProcessApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProcessesId.replace('{id}', String(id)),
  };
  return defHttp.delete<IProcess>(config, { errorMessageMode: mode });
};
