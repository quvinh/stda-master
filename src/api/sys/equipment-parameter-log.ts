import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';

enum Api {
  EquipmentParameterLog = '/oi-equipment/equipment-parameter-logs',
}

/**
 * @description: search
 */
export const searchApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentParameterLog,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
