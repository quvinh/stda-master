import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { AxiosRequestConfig } from 'axios';

enum Api {
  QUALITY_NG_CHECK = '/quality-ng-checks',
}

/**
 * @description search
 */
export const searchQualityNGCheckApi = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.QUALITY_NG_CHECK,
    params: params,
  };
  return defHttp.get<any>(config);
};
