import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';
import { ErrorMessageMode } from '#/axios';
// import { IEquipmentMaintenancePlan } from '../model/IEquipmentMaintenancePlan';

enum Api {
  EquipmentMaintenancePlan = '/maintenance-plan',
  EquipmentMaintenancePlanId = '/maintenance-plan/{id}',
  EquipmentMaintenancePlanExport = '/maintenance-plan/export',
}

/**
 * @description list production-plan
 */
export const searchApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenancePlan,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const updateApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenancePlanId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<any>(config, { errorMessageMode: mode });
};

export const exportExcelData = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenancePlanExport,
  };
  return defHttp.get<any>(config);
};
