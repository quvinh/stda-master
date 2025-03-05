import { IEquipment_Parameter } from './../model/IEquipment_Parameter';
import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';

enum Api {
  EquipmentParameter = '/equipment-parameters',
  EquipmentParameteId = '/equipment-parameters/{id}',
  ExportEquipmentParameter = '/equipment-parameters-export',
}

/**
 * @description: search
 */
export const searchEquipmentParameterApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentParameter,
    params: params,
  };
  return defHttp.get<IEquipment_Parameter>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createEquipmentParameterApi = (
  payload: IEquipment_Parameter,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentParameter,
    params: payload,
  };
  return defHttp.post<IEquipment_Parameter | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateEquipmentParameterApi = (
  payload: any = {},
  mode: ErrorMessageMode = 'modal',
) => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentParameteId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IEquipment_Parameter>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteEquipmentParameterApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentParameteId.replace('{id}', String(id)),
  };
  return defHttp.delete<IEquipment_Parameter>(config, { errorMessageMode: mode });
};
export const exportExcelDataEquipmentParameterApi = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportEquipmentParameter,
  };
  return defHttp.get<IEquipment_Parameter>(config);
};
