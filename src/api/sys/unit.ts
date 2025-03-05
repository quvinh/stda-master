import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IUnit } from '../model/IUnit';

enum Api {
  Unit = '/units',
  UnitId = '/units/{id}',
  ExportUnit = '/units-export',
}

/**
 * @description: search
 */
export const searchUnitApi = (params: any = {}, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Unit,
    params: params,
  };
  return defHttp.get<IUnit>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createUnitApi = (payload: IUnit, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Unit,
    params: payload,
  };
  return defHttp.post<IUnit | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateUnitApi = (payload: IUnit, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.UnitId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IUnit>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteUnitApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.UnitId.replace('{id}', String(id)),
  };
  return defHttp.delete<IUnit>(config, { errorMessageMode: mode });
};
export const exportExcelData = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportUnit,
  };
  return defHttp.get<any>(config);
};
