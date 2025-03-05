import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IProductCategory } from '../model/IProductCategory';

enum Api {
  ProductCategory = '/product-categories',
  ProductCategoryId = '/product-categories/{id}',
  ProductCategoryExport = '/product-categories-export',
}

/**
 * @description: search
 */
export const searchProductCategoryApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductCategory,
    params: params,
  };
  return defHttp.get<IProductCategory>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createProductCategoryApi = (
  payload: IProductCategory,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductCategory,
    params: payload,
  };
  return defHttp.post<IProductCategory | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateProductCategoryApi = (
  payload: IProductCategory,
  mode: ErrorMessageMode = 'modal',
) => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductCategoryId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IProductCategory>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteProductCategoryApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductCategoryId.replace('{id}', String(id)),
  };
  return defHttp.delete<IProductCategory>(config, { errorMessageMode: mode });
};

export const exportProductCategoryApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductCategoryExport,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
