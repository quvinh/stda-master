import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { AxiosRequestConfig } from 'axios';

enum Api {
  LOT = '/lots/{id}',
}

/**
 * @description Get lot by id
 */
export const getLotApi = (id: string) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.LOT.replace('{id}', id),
  };
  return defHttp.get<any>(config);
};
