import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';
import { ErrorMessageMode } from '#/axios';
// import { IEquipmentMaintenancePlan } from '../model/IEquipmentMaintenancePlan';

enum Api {
  EquipmentMaintenanceCategory = '/maintenance-category',
  EquipmentMaintenanceCategoryId = '/maintenance-category/{id}',
  MaintenanceItem = '/maintenance-schedules/maintenance-item',
}

/**
 * @description list production-category
 */
export const searchApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceCategory,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const searchMaintenanceItemApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaintenanceItem,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description: create
 */
export const createApi = (payload: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceCategory,
    params: payload,
  };
  return defHttp.post<any>(config, { errorMessageMode: mode });
};

export const updateApi = (payload: any = {}, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceCategoryId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<any>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceCategoryId.replace('{id}', String(id)),
  };
  return defHttp.delete<any>(config, { errorMessageMode: mode });
};
