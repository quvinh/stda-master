import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';

enum Api {
  EAV = '/attributes',
  EAV_MODELS = '/eav-models',
}

/**
 * @description search attributes
 */
export const searchEAVApi = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EAV,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description get attributes by id
 */
export const getEAVApi = (id: number | string) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EAV + '/' + id,
  };
  return defHttp.get<any>(config);
};

/**
 * @description create
 */
export const createEAVApi = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EAV,
    params: params,
  };
  return defHttp.post<any>(config);
};

/**
 * @description update
 */
export const updateEAVApi = (id: number | string, params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EAV + '/' + id,
    params,
  };
  return defHttp.put<any>(config);
};

/**
 * @description delete
 */
export const deleteEAVApi = (id: number | string, params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EAV + '/' + id,
    params,
  };
  return defHttp.delete<any>(config);
};

/**
 * @description eav models
 */
export const getEAVModelsApi = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EAV_MODELS,
  };
  return defHttp.get<any>(config);
};
