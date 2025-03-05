import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IAcceptanceQualityLimit } from '../model/IAcceptanceQualityLimit';

enum Api {
  AcceptanceQualityLimit = '/acceptance-quality-limits',
  AcceptanceQualityLimitId = '/acceptance-quality-limits/{id}',
}

/**
 * @description: search
 */
export const searchApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.AcceptanceQualityLimit,
    params: params,
  };
  return defHttp.get<IAcceptanceQualityLimit>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createApi = (payload: IAcceptanceQualityLimit, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.AcceptanceQualityLimit,
    params: payload,
  };
  return defHttp.post<IAcceptanceQualityLimit | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateApi = (payload: IAcceptanceQualityLimit, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.AcceptanceQualityLimitId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IAcceptanceQualityLimit>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.AcceptanceQualityLimitId.replace('{id}', String(id)),
  };
  return defHttp.delete<IAcceptanceQualityLimit>(config, { errorMessageMode: mode });
};
