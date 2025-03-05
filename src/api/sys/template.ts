import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { AxiosRequestConfig } from 'axios';
import { ITemplate } from '../model/ITemplate';

enum Api {
  Template = '/templates',
  TemplateId = '/templates/{id}',
  TemplatePreviewId = '/print/preview/{id}',
}

/**
 * @description: search
 */
export const searchTemplateApi = (params: any, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Template,
    params: params,
  };
  return defHttp.get<ITemplate>(config, { errorMessageMode: mode });
};

/**
 * @description: create
 */
export const createTemplateApi = (payload: ITemplate, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Template,
    params: payload,
  };
  return defHttp.post<ITemplate | any>(config, { errorMessageMode: mode });
};

/**
 * @description: update
 */
export const updateTemplateApi = (
  payload: ITemplate | any = {},
  mode: ErrorMessageMode = 'modal',
) => {
  if (!payload.id) return;
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.TemplateId.replace('{id}', String(payload.id)),
    params: payload,
  };
  return defHttp.put<ITemplate>(config, { errorMessageMode: mode });
};

/**
 * @description: delete
 */
export const deleteTemplateApi = (id: number, mode: ErrorMessageMode = 'modal') => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.TemplateId.replace('{id}', String(id)),
  };
  return defHttp.delete<ITemplate>(config, { errorMessageMode: mode });
};

/**
 * @description: preview
 */
export const previewTemplateApi = (id: string | number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.TemplatePreviewId.replace('{id}', String(id)),
  };
  return defHttp.get<ITemplate>(config);
};
