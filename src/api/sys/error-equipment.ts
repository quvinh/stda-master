import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IErrorEquipment } from '../model/IErrorEquipment';

enum Api {
  ErrorEquipments = '/error-equipments',
  ErrorEquipment = '/oi-equipment/error-equipments',
  ErrorEquipmentsId = '/error-equipments/{id}',
  ErrorEquipmentsExport = '/error-equipments-export',
}

/**
 * @description: search
 */
export const searchErrorEquipmentApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorEquipment,
    params: params,
  };
  return defHttp.get<IErrorEquipment>(config, { errorMessageMode: mode });
};

export const findAllErrorEquipmentId = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorEquipments,
    params: params,
  };

  return defHttp.get<any>(config);
};

/**
 * @description: create
 */
export const createErrorEquipmentApi = (
  payload: IErrorEquipment,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorEquipments,
    params: payload,
  };
  return defHttp.post<IErrorEquipment | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateErrorEquipmentApi = (
  payload: IErrorEquipment,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorEquipmentsId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IErrorEquipment>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteErrorEquipmentApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorEquipmentsId.replace('{id}', String(id)),
  };
  return defHttp.delete<IErrorEquipment>(config, { errorMessageMode: mode });
};

export const exportExcelData = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ErrorEquipmentsExport,
  };
  return defHttp.get<IErrorEquipment>(config);
};
