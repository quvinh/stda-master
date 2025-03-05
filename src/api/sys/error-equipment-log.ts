import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';

enum Api {
  ErrorEquipmentLogs = '/error-equipment-logs',
  ErrorEquipmentLog = '/oi-equipment/error-equipment-logs',
  ErrorEquipmentLogID = '/oi-equipment/error-equipment-logs/{id}',
  ErrorEquipmentLogId = '/error-equipment-logs/{id}',
  OEE = '/error-equipment-logs/chart/oee',
}

/**
 * @description: search
 */
export const searchErrorEquipmentLogApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorEquipmentLog,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const searchOEEApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.OEE,
    params: params,
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const updateErrorEquipmentLogApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorEquipmentLogID.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.post<any>(config, { errorMessageMode: mode });
};
