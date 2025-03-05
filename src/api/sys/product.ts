import { ErrorMessageMode } from '#/axios';
import { getToken } from '@/utils/auth';
import { AxiosRequestConfig } from 'axios';
import { getDefaultAxiosOption } from './helper/core';
import { defHttp } from '@/utils/http/axios';
import { IProduct } from '../model/IProduct';

enum Api {
  Product = '/products',
  ProductId = '/products/{id}',
  ExportProduct = '/products-export',
}

//search

export const searchProductApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Product,
    params: params,
  };
  return defHttp.get<IProduct>(config, { errorMessageMode: mode });
};

//create

export const createProductApi = (payload: IProduct, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Product,
    params: payload,
  };
  return defHttp.post<IProduct | any>(config, { errorMessageMode: mode });
};

//update

export const updateProductApi = (payload: IProduct, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IProduct>(config, { errorMessageMode: mode });
};

//delete

export const deleteProductApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductId.replace('{id}', String(id)),
  };
  return defHttp.delete<IProduct>(config, { errorMessageMode: mode });
};
export const exportExcelData = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportProduct,
  };
  return defHttp.get<IProduct>(config);
};
