import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IManufactureHistory } from '../model/IManufactureHistory';

enum Api {
  ManufactureHistory = '/batch-histories',
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
