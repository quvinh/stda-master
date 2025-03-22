import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { AxiosRequestConfig } from 'axios';

enum Api {
  Quizz = '/quizzes',
  Question = '/questions',
  Answer = '/answers',
}

export const getQuizz = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Quizz,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const getQuestion = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Question,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const getAnswer = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Answer,
    params: params,
  };
  return defHttp.get<any>(config);
};
