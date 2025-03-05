import { ErrorMessageMode } from '#/axios';
import { getToken } from '@/utils/auth';
import { AxiosRequestConfig } from 'axios';
import { getDefaultAxiosOption } from './helper/core';
import { defHttp } from '@/utils/http/axios';
import ISpec from '../model/ISpec';

enum Api {
  Specs = '/specs',
  Spec = '/specs/{id}',
  ExportSpec = '/specs-export',
}

//search

export const searchSpecApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Specs,
    params: params,
  };
  return defHttp.get<ISpec>(config, { errorMessageMode: mode });
};

//create

export const createSpecApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Specs,
    params: payload,
  };
  return defHttp.post<any | any>(config, { errorMessageMode: mode });
};

//update

export const updateSpecApi = (payload: any, mode: ErrorMessageMode = 'modal') => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Spec.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<any>(config, { errorMessageMode: mode });
};

//delete

export const deleteSpecApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Spec.replace('{id}', String(id)),
  };
  return defHttp.delete<any>(config, { errorMessageMode: mode });
};

export const exportExcelDataSpec = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportSpec,
  };
  return defHttp.get<ISpec>(config);
};
