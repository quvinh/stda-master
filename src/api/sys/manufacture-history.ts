import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IManufactureHistory } from '../model/IManufactureHistory';

enum Api {
  ManufactureHistory = '/batch-histories',
  OverallLotHistories = '/ui-overall-lot-histories',
  ManufactureHistoryExport = '/production-plans-export/manufacturing-history',
  GetLast7Days = '/manufacture/last-7-days-cycle-time',
}

/**
 * @description: search
 */
export const searchApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ManufactureHistory,
    params: params,
  };
  return defHttp.get<IManufactureHistory>(config, { errorMessageMode: mode });
};

export const getLast7DaysApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.GetLast7Days,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const searchOverallLotHistoriesApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.OverallLotHistories,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const exportApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ManufactureHistoryExport,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
