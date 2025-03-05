import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IWarehouseLocation } from '../model/IWarehouseLocation';

enum Api {
  WarehouseLocations = '/warehouse-locations',
  WarehouseLocationsId = '/warehouse-locations/{id}',
  WarehouseLocationsIds = '/warehouse/warehouse-locations/{id}',
  WarehouseLocationsExport = '/warehouse-locations-export',
  WarehouseLocationMaterialExportItem = '/warehouse-locations/material-export-item/{id}',
}

/**
 * @description: search
 */
export const searchWarehouseLocationApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseLocations,
    params: params,
  };
  return defHttp.get<IWarehouseLocation>(config, { errorMessageMode: mode });
};

/**
 * @description: get
 */
export const getWarehouseLocationApi = (id: string) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseLocationsId.replace('{id}', String(id)),
  };
  return defHttp.get<any>(config);
};

/**
 * @description: create
 */
export const createWarehouseLocationApi = (
  payload: IWarehouseLocation,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseLocations,
    params: payload,
  };
  return defHttp.post<IWarehouseLocation | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateWarehouseLocationApi = (
  payload: IWarehouseLocation,
  mode: ErrorMessageMode = 'modal',
) => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseLocationsId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IWarehouseLocation>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteWarehouseLocationApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseLocationsId.replace('{id}', String(id)),
  };
  return defHttp.delete<IWarehouseLocation>(config, { errorMessageMode: mode });
};

export const exportWarehouseLocationApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseLocationsExport,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};

/**
 * @description gợi ý xuất kho theo phiếu xuất(con)
 */
export const getMaterialExportItemApi = (id: string | number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.WarehouseLocationMaterialExportItem.replace('{id}', String(id)),
  };
  return defHttp.get<any>(config);
};
