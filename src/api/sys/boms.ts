import { IBoms } from './../model/IBoms';
import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';

enum Api {
  Boms = '/boms',
  BomsId = '/boms/{id}',
  BomLog = '/model-log',
}

/**
 * @description: search
 */
export const searchBomApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Boms,
    params: params,
  };
  return defHttp.get<IBoms>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createBomApi = (payload: IBoms, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Boms,
    params: payload,
  };
  return defHttp.post<IBoms | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateBomApi = (payload: IBoms | any = {}, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.BomsId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IBoms>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteBomApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.BomsId.replace('{id}', String(id)),
  };
  return defHttp.delete<IBoms>(config, { errorMessageMode: mode });
};

export const searchLogApi = (param: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.BomLog,
    params: param,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
