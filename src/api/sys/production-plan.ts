import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';
import { IProductionPlan } from '../model/IProductionPlan';
import { ErrorMessageMode } from '#/axios';

enum Api {
  LotHistories = '/oi-lot-histories-latest',
  BatchHistories = '/oi-batch-histories-latest',
  ProductionPlan = '/production-plans',
  ProductionPlanId = '/production-plans/{id}',
  ExportProductPlan = '/production-plans-export',
  MappingOiManufacture = '/manufacture/mapping-oi-manufacture',
  GetPackingPrintData = '/manufacture/get-packing-print-data',
}

/**
 * @description oi-lot-histories
 */
export const oiLotHistoriesApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.LotHistories,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const getOiManufactureRunningLotApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: '/manufacture/oi-manufacture-lots',
    params: params,
  };
  return defHttp.get<any>(config);
};

export const mergeLotsApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: '/manufacture/merge-lots',
    params: params,
  };
  return defHttp.post<any>(config);
};

export const getOiManufactureOverview = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: '/manufacture/overview',
    params: params,
  };
  return defHttp.get<any>(config);
};

export const getOiManufactureMiddle = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: '/manufacture/running-lot',
    params: params,
  };
  return defHttp.get<any>(config);
};

export const getManufactureWarnings = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: '/manufacture/get-manufacture-warnings',
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description get-packing-print-data
 */
export const getPackingPrintDataApi = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.GetPackingPrintData,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description oi-batch-histories
 */
export const oiBatchHistoriesApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.BatchHistories,
    params: params,
  };
  return defHttp.get<any>(config);
};

/**
 * @description list production-plan
 */
export const searchApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductionPlan,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const updateApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  if (!params.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ProductionPlanId.replace('{id}', String(params.id)),
    params: params,
  };
  return defHttp.put<any>(config, { errorMessageMode: mode });
};

export const exportExcelData = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ExportProductPlan,
  };
  return defHttp.get<IProductionPlan>(config);
};

export const getOiMappingOiManufactureApi = (params: any, mode: ErrorMessageMode = 'none') => {
  const token: any = getToken();
  // alert(token);
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.MappingOiManufacture,
    params: params,
  };
  return defHttp.post<any>(config, { errorMessageMode: mode });
};
