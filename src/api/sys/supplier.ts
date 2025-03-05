import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { ISupplier } from '../model/ISupplier';

enum Api {
  Supplier = '/suppliers',
  SupplierId = '/suppliers/{id}',
  SupplierExport = '/suppliers-export',
}

/**
 * @description: search
 */
export const searchSupplierApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Supplier,
    params: params,
  };
  return defHttp.get<ISupplier>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createSupplierApi = (payload: ISupplier, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Supplier,
    params: payload,
  };
  return defHttp.post<ISupplier | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateSupplierApi = (payload: ISupplier, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SupplierId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<ISupplier>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteSupplierApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SupplierId.replace('{id}', String(id)),
  };
  return defHttp.delete<ISupplier>(config, { errorMessageMode: mode });
};

export const exportSupplierApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SupplierExport,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
