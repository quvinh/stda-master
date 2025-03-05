import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IProductionOrder } from '../model/IProductionOrder';

enum Api {
  ProductOrders = '/production-orders',
  ProductOrdersId = '/production-orders/{id}',
  ProductOrdersExport = '/production-orders-export',
}

/**
 * @description: search
 */
export const searchProductOrderApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductOrders,
    params: params,
  };
  return defHttp.get<IProductionOrder>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createProductOrderApi = (
  payload: IProductionOrder,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductOrders,
    params: payload,
  };
  return defHttp.post<IProductionOrder | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateProductOrderApi = (
  payload: IProductionOrder,
  mode: ErrorMessageMode = 'modal',
) => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductOrdersId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IProductionOrder>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteProductOrderApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductOrdersId.replace('{id}', String(id)),
  };
  return defHttp.delete<IProductionOrder>(config, { errorMessageMode: mode });
};

export const exportProductOrderApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductOrdersExport,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
