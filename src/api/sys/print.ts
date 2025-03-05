import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';

enum Api {
  PrintBatch = '/print/batch',
  PrintBasic = '/print/print-basic',
  PrintMold = '/print/mold',
  PrintPallet = '/print/pallet',
  PrintPalletSeparate = '/print/pallet-separate',
  PrintMergeLots = '/print/merge-lots',
  PrintPackingPallet = '/manufacture/print-packing-pallet-template',
}

/**
 * @description print batch
 */
export const printBatch = (payload: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PrintBatch,
    params: payload,
  };
  return defHttp.get<any>(config);
};

/**
 * @description print basic
 */
export const printBasic = (payload: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PrintBasic,
    params: payload,
  };
  return defHttp.get<any>(config);
};

/**
 * @description print pallet
 */
export const printPallet = (payload: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PrintPallet,
    params: payload,
  };
  return defHttp.get<any>(config);
};

/**
 * @description print pallet separate
 */
export const printPalletSeparate = (payload: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PrintPalletSeparate,
    params: payload,
  };
  return defHttp.get<any>(config);
};

/**
 * @description print mold
 */
export const printMold = (payload: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PrintMold,
    params: payload,
  };
  return defHttp.get<any>(config);
};

/**
 * @description print merge lots
 */
export const printMergeLots = (payload: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PrintMergeLots,
    params: payload,
  };
  return defHttp.get<any>(config);
};

/**
 * @description print-packing-pallet-template
 */
export const printPackingPalletTemplate = (payload: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.PrintPackingPallet,
    params: payload,
  };
  return defHttp.post<any>(config);
};
