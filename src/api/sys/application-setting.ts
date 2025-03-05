import { getToken } from '@/utils/auth';
import { AxiosRequestConfig } from 'axios';
import { getDefaultAxiosOption } from './helper/core';
import { defHttp } from '@/utils/http/axios';
import { IApplicationSetting } from '../model/IApplicationSetting';

enum Api {
  ApplicationSetting = '/application-settings',
  ApplicationSettingId = '/application-settings/{id}',
}

/**
 * @description: search
 */
export const searchApplicationSettingApi = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ApplicationSetting,
    params: params,
  };
  return defHttp.get<IApplicationSetting>(config);
};

/**
 * @description: create
 */

export const createApplicationSettingApi = (payload: IApplicationSetting) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ApplicationSetting,
    params: payload,
  };
  return defHttp.post<IApplicationSetting | any>(config);
};

/**
 * @description: update
 */

export const updateApplicationSettingApi = (payload: IApplicationSetting) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ApplicationSettingId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IApplicationSetting>(config);
};

export const deleteApplicationSettingApi = (id: number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ApplicationSettingId.replace('{id}', String(id)),
  };
  return defHttp.delete<IApplicationSetting>(config);
};
