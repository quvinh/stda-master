import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import IErrorQuality from '../model/IErrorQuality';

enum Api {
  ErrorQualities = '/error-qualities',
  ErrorQualitiesId = '/error-qualities/{id}',
}

/**
 * @description: search
 */
export const searchErrorQualityApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorQualities,
    params: params,
  };
  return defHttp.get<IErrorQuality>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createErrorQualityApi = (payload: IErrorQuality, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorQualities,
    params: payload,
  };
  return defHttp.post<IErrorQuality | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateErrorQualityApi = (payload: IErrorQuality, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorQualitiesId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IErrorQuality>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteErrorQualityApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorQualitiesId.replace('{id}', String(id)),
  };
  return defHttp.delete<IErrorQuality>(config, { errorMessageMode: mode });
};
