import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';
import { ErrorMessageMode } from '#/axios';

enum Api {
  EquipmentMaintenanceSchedule = '/maintenance-schedules',
  EquipmentMaintenanceScheduleExport = '/maintenance-schedules/export',
  EquipmentMaintenanceScheduleDetailExport = '/maintenance-schedules/export-detail',
  EquipmentMaintenanceScheduleId = '/maintenance-schedules/{id}',
}

export const exportExcelData = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceScheduleExport,
    params,
  };
  return defHttp.get<any>(config);
};

export const exportDeatilExcelData = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceScheduleDetailExport,
    params,
  };
  return defHttp.get<any>(config);
};

export const getScheduledMaintenance = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceSchedule,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const updateMaintenanceLog = (payload: any, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceScheduleId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<any>(config, { errorMessageMode: mode });
};
