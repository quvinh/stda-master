import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IIQC } from '../model/IIQC';

enum Api {
  IQC = '/material-receipt-items',
  IQCExport = '/material-receipt-items-export',
}

/**
 * @description: search
 */
export const searchApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.IQC,
    params: params,
  };
  return defHttp.get<IIQC>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createApi = (payload: IIQC, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.IQC,
    params: payload,
  };
  return defHttp.post<IIQC | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateApi = (payload: IIQC, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.IQC,
    params: payload,
  };
  return defHttp.put<IIQC>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.IQC,
  };
  return defHttp.delete<IIQC>(config, { errorMessageMode: mode });
};

export const exportExcelData = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.IQCExport,
  };
  return defHttp.get<IIQC>(config);
};
