import { getToken } from '@/utils/auth';
import { AxiosRequestConfig } from 'axios';
import { getDefaultAxiosOption } from './helper/core';
import { defHttp } from '@/utils/http/axios';
import { IDepartment } from '../model/IDepartment';

enum Api {
  Department = '/departments',
  DepartmentId = '/departments/{id}',
}

/**
 * @description: search
 */
export const searchDepartmentApi = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Department,
    params: params,
  };
  return defHttp.get<IDepartment>(config);
};

/**
 * @description: create
 */

export const createDepartmentApi = (payload: IDepartment) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Department,
    params: payload,
  };
  return defHttp.post<IDepartment | any>(config);
};

/**
 * @description: update
 */

export const updateDepartmentApi = (payload: IDepartment) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.DepartmentId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IDepartment>(config);
};

export const deleteDepartmentApi = (id: number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.DepartmentId.replace('{id}', String(id)),
  };
  return defHttp.delete<IDepartment>(config);
};
