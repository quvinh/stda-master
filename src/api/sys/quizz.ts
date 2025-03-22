import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { AxiosRequestConfig } from 'axios';

enum Api {
  Quizz = '/quizzes',
  Question = '/questions',
  Answer = '/answers',
  Complete = '/quiz-attempts',
  SaveAnswer = '/quiz/save-answer',
  SubmitQuiz = '/quiz/submit',
  CountQuizCompleted = '/quiz/count',
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

export const complete = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Complete,
    params: params,
  };
  return defHttp.post<any>(config);
};

export const saveAnswer = (data: { quiz_id: number; question_id: number; score: number }) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SaveAnswer,
    data: data,
  };
  return defHttp.post<any>(config);
};

export const submitQuiz = (data: { quiz_id: number }) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SubmitQuiz,
    data: data,
  };
  return defHttp.post<any>(config);
};

export const countQuizComlete = (params?: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.CountQuizCompleted,
    data: params,
  };
  return defHttp.get<any>(config);
};
