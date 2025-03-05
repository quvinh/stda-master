import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IPallet } from '../model/IPallet';

enum Api {
  Pallet = '/pallets',
  Pallets = '/warehouse/pallets',
  PalletId = '/pallets/{id}',
  QualityCheck = '/quality-checks',
}

/**
 * @description: search
 */
export const searchApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Pallets,
    params: params,
  };
  return defHttp.get<IPallet>(config, { errorMessageMode: mode });
};

/**
 * @description: get
 */
export const getApi = (id: string) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PalletId.replace('{id}', String(id)),
  };
  return defHttp.get<IPallet>(config);
};

/**
 * @description: create
 */
export const createApi = (payload: IPallet, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Pallet,
    params: payload,
  };
  return defHttp.post<IPallet | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  console.log(payload);
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PalletId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IPallet>(config, { errorMessageMode: mode });
};

export const updateQualityCheckApi = (payload: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.QualityCheck.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<any>(config);
};

/**
 * @description: delete
 */
export const deleteApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PalletId.replace('{id}', String(id)),
  };
  return defHttp.delete<IPallet>(config, { errorMessageMode: mode });
};
