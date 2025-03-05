import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { AxiosRequestConfig } from 'axios';

enum Api {
  LogOQC = '/qc/log-oqc',
  GetPQCLots = '/qc/get-pqc-lots',
  GetOQCLots = '/qc/get-oqc-lots',
  OIPrintPalletTemplate = '/manufacture/print-pallet-template',
}

/**
 * @description log-oqc
 */
export const logOQC = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.LogOQC,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description OI: Get PQC Lots
 */
export const getPQCLots = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.GetPQCLots,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description OI: Get OQC Lots
 */
export const getOQCLots = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.GetOQCLots,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description In tem ở OI Sản xuất
 */
export const printPalletTemplate = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.OIPrintPalletTemplate,
    params: params,
  };
  return defHttp.post<any>(config);
};
