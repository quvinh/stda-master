import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IWarehouseLocation } from '../model/IWarehouseLocation';

enum Api {
  WarehouseHistorySummary = '/warehouse-histories/summary',
}

/**
 * @description summary
 */
export const getWarehouseHistorySummaryApi = (
  params: any = {},
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseHistorySummary,
    params: params,
  };
  return defHttp.get<IWarehouseLocation>(config, { errorMessageMode: mode });
};
