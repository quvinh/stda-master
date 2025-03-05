import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { ICustomer } from '../model/ICustomer';

enum Api {
  Customer = '/customers',
  CustomerId = '/customers/{id}',
  ExportCustomer = '/export-customers',
  CustomerLog = '/model-log',
}

/**
 * @description: search
 */
export const searchCustomerApi = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Customer,
    params: params,
  };
  return defHttp.get<ICustomer>(config);
};

/**
 * @description: create
 */
export const createCustomerApi = (payload: ICustomer, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Customer,
    params: payload,
  };
  return defHttp.post<ICustomer | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateCustomerApi = (payload: ICustomer, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.CustomerId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<ICustomer>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteCustomerApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.CustomerId.replace('{id}', String(id)),
  };
  return defHttp.delete<ICustomer>(config, { errorMessageMode: mode });
};

export const exportExcelData = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportCustomer,
  };
  return defHttp.get<ICustomer>(config);
};

export const searchLogApi = (param: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.CustomerLog,
    params: param,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
