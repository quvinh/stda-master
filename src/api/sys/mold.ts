import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';
import { IMold } from '../model/IMold';

enum Api {
  Mold = '/molds',
  MoldId = '/molds/{id}',
  MoldExport = '/molds-export',
}

/**
 * @description list
 */
export const searchMoldApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Mold,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description: create
 */
export const createMoldApi = (payload: IMold) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Mold,
    params: payload,
  };
  return defHttp.post<IMold | any>(config);
};

/**
 * @description: update
 */
export const updateMoldApi = (payload: IMold) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MoldId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IMold>(config);
};

/**
 * @description: delete
 */
export const deleteMoldApi = (id: number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MoldId.replace('{id}', String(id)),
  };
  return defHttp.delete<IMold>(config);
};

export const exportExcelDataMoldApi = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MoldExport,
  };
  return defHttp.get<any>(config);
};
