import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { AxiosRequestConfig } from 'axios';

enum Api {
  OI_SUMMARY_IQC = '/oi-quality/summary-iqc',
}

/**
 * @description: summary iqc
 */
export const oiSummaryIQC = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.OI_SUMMARY_IQC,
    params: params,
  };
  return defHttp.get<any>(config);
};
