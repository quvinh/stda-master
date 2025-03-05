import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { IInspectionCriteria } from '../model/IInspectionCriteria';

enum Api {
  InspectionCriterias = '/inspection-criteria',
  InspectionCriteriasSearch = '/inspection-criteria/search',
  InspectionCriteriasId = '/inspection-criteria/{id}',
  InspectionCriteriasExport = '/inspection-criteria-export',
}

/**
 * @description: search
 */
export const searchInspectionCriteriaApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.InspectionCriterias,
    params: params,
  };
  return defHttp.get<IInspectionCriteria>(config, { errorMessageMode: mode });
};

/**
 * @description get data with pagination
 */
export const getListInspectionCriterias = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.InspectionCriterias,
    params: params,
  };
  return defHttp.get<IInspectionCriteria>(config);
};

/**
 * @description: create
 */
export const createInspectionCriteriaApi = (
  payload: IInspectionCriteria,
  mode: ErrorMessageMode = 'modal',
) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.InspectionCriterias,
    params: payload,
  };
  return defHttp.post<IInspectionCriteria | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateInspectionCriteriaApi = (
  payload: any = {},
  mode: ErrorMessageMode = 'modal',
) => {
  if (!payload.id) return;
  const token: any = getToken();
  console.log(payload);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.InspectionCriteriasId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<IInspectionCriteria>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteInspectionCriteriaApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.InspectionCriteriasId.replace('{id}', String(id)),
  };
  return defHttp.delete<IInspectionCriteria>(config, { errorMessageMode: mode });
};

/**
 * @description: search criteria for qc
 */
export const searchByType = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.InspectionCriterias.concat('/search'),
    params,
  };
  return defHttp.get<IInspectionCriteria>(config, { errorMessageMode: mode });
};

export const exportInspectionCriteriaApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.InspectionCriteriasExport,
    params: params,
    responseType: 'json',
  };
  return defHttp.get<any>(config, { errorMessageMode: mode });
};
