import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { AxiosRequestConfig } from 'axios';

enum Api {
  IS_SAFE_FOR_MAPPING = '/equipment/is-safe-for-mapping',
}

/**
 * @description is-safe-for-mapping
 */
export const isSafeForMappingApi = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.IS_SAFE_FOR_MAPPING,
    params: params,
  };
  return defHttp.get<any>(config);
};
