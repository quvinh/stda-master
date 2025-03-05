import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IMaterial } from '../model/IMaterial';

enum Api {
  Material = '/materials',
  MaterialId = '/materials/{id}',
  MaterialExport = '/materials-export',
}

/**
 * @description: search
 */
export const searchMaterialApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Material,
    params: params,
  };
  return defHttp.get<IMaterial>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createMaterialApi = (payload: IMaterial, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Material,
    params: payload,
  };
  return defHttp.post<IMaterial | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateMaterialApi = (payload: IMaterial, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IMaterial>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteMaterialApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialId.replace('{id}', String(id)),
  };
  return defHttp.delete<IMaterial>(config, { errorMessageMode: mode });
};

export const exportMaterialApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialExport,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
