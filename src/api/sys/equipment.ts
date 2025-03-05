import { IEquipment } from './../model/IEquipment';
import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';

enum Api {
  Equipment = '/equipments',
  EquipmentId = '/equipments/{id}',
  EquipmentExport = '/equipments-export',
  PrintOiTemplate = '/manufacture/print-template',
}

/**
 * @description: search
 */
export const searchEquipmentApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    // url: `http://127.0.0.1:8000/equipments`,
    url: Api.Equipment,
    params: params,
  };
  return defHttp.get<IEquipment>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createEquipmentApi = (payload: IEquipment, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Equipment,
    params: payload,
  };
  return defHttp.post<IEquipment | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateEquipmentApi = (payload: IEquipment, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IEquipment>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteEquipmentApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentId.replace('{id}', String(id)),
  };
  return defHttp.delete<IEquipment>(config, { errorMessageMode: mode });
};

export const exportEquipmentApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentExport,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

export const printTemplteApi = (
  equipment_id: IEquipment['id'],
  mode: ErrorMessageMode = 'none',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PrintOiTemplate,
    params: { equipment_id },
    responseType: 'json',
  };
  return defHttp.post<any>(config, { errorMessageMode: mode });
};

export const getOiEquipmentOverview = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: '/equipment/oi-overview',
    params: params,
  };
  return defHttp.get<any>(config);
};
