import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';
import { getDefaultAxiosOption } from './helper/core';

import { AxiosRequestConfig } from 'axios';

enum Api {
  BatchId = '/batches/{id}',
}

/**
 * @description get batch by id
 */
export const getBatchApi = (id: string | number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.BatchId.replace('{id}', String(id)),
  };
  return defHttp.get<any>(config);
};
