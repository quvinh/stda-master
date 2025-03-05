import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IMaterial } from '../model/IMaterial';
import { ISemiFinishedProduct } from '../model/ISemiFinishedProduct';

enum Api {
  SemiFinishedProducts = '/semi-finished-products',
  SemiFinishedProduct = '/semi-finished-products/{id}',
  MaterialExport = '/materials-export',
}

/**
 * @description: search
 */
export const searchApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SemiFinishedProducts,
    params: params,
  };
  return defHttp.get<ISemiFinishedProduct>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SemiFinishedProducts,
    params: payload,
  };
  return defHttp.post<any | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateApi = (payload: IMaterial, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SemiFinishedProduct.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IMaterial>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SemiFinishedProduct.replace('{id}', String(id)),
  };
  return defHttp.delete<IMaterial>(config, { errorMessageMode: mode });
};

export const exportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialExport,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
