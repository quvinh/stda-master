import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';

enum Api {
  BatchHistories = '/batch-histories',
  BatchHistoriesId = '/batch-histories/{id}',
  qualityChecks = '/quality-checks',
}

/**
 * @description search batch-history
 */
export const searchBatchHistoryApi = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.BatchHistories,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description update batch-history
 */
export const updateBatchHistoryApi = (id: string | number, params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.BatchHistoriesId.replace('{id}', String(id)),
    params: params,
  };
  return defHttp.put<any>(config);
};

/**
 * @description create quality-check batch-history
 */
export const createQualityCheck = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.qualityChecks,
    params: params,
  };
  return defHttp.post<any>(config);
};
/**
 * @description get batch-history
 */
export const getBatchHistoryApi = (id: string | number, params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.BatchHistoriesId.replace('{id}', String(id)),
    params: params,
  };
  return defHttp.get<any>(config);
};
