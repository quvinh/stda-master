import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IStandardParameter } from '../model/IStandardParameter';

enum Api {
  StandardParameters = '/standard-parameters',
  StandardParametersId = '/standard-parameters/{id}',
  ExportStandarParameter = '/standard-parameters-export',
}

/**
 * @description: search
 */
export const searchStandardParameterApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.StandardParameters,
    params: params,
  };
  return defHttp.get<IStandardParameter>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createStandardParameterApi = (
  payload: IStandardParameter,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.StandardParameters,
    params: payload,
  };
  return defHttp.post<IStandardParameter | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateStandardParameterApi = (payload: any = {}, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.StandardParametersId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IStandardParameter>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteStandardParameterApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.StandardParametersId.replace('{id}', String(id)),
  };
  return defHttp.delete<IStandardParameter>(config, { errorMessageMode: mode });
};

export const exportExcelDataStandardParameterApi = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportStandarParameter,
    responseType: 'json',
  };
  return defHttp.get<IStandardParameter>(config);
};
