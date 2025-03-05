import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IMaterialCategory } from '../model/IMaterialCategory';

enum Api {
  MaterialCategories = '/material-categories',
  MaterialCategoriesId = '/material-categories/{id}',
  MaterialCategoriesExport = '/material-categories-export',
}

/**
 * @description: search
 */
export const searchMaterialCategoryApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialCategories,
    params: params,
  };
  return defHttp.get<IMaterialCategory>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createMaterialCategoryApi = (
  payload: IMaterialCategory,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialCategories,
    params: payload,
  };
  return defHttp.post<IMaterialCategory | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateMaterialCategoryApi = (
  payload: IMaterialCategory,
  mode: ErrorMessageMode = 'modal',
) => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialCategoriesId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IMaterialCategory>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteMaterialCategoryApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialCategoriesId.replace('{id}', String(id)),
  };
  return defHttp.delete<IMaterialCategory>(config, { errorMessageMode: mode });
};

export const exportMaterialCategoryApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MaterialCategoriesExport,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
