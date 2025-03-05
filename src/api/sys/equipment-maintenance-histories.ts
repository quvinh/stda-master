import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { UploadFileParams } from '#/axios';
import { UploadApiResult } from './model/uploadModel';

enum Api {
  EquipmentMaintenanceHistory = '/maintenance-logs',
  EquipmentMaintenanceHistoryExport = '/maintenance-logs/export',
  ImageUploadUrl = '/maintenance-logs/upload-images',
}

/**
 * @description list production-plan
 */
export const searchApi = (params: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceHistory,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const exportExcelData = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.EquipmentMaintenanceHistoryExport,
  };
  return defHttp.get<any>(config);
};

export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.ImageUploadUrl,
  };
  return defHttp.uploadFile<any>(config, params);
}
