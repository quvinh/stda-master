import { getDefaultAxiosOption } from './helper/core';
import { getToken } from '@/utils/auth';
import { defHttp } from '@/utils/http/axios';

import { AxiosRequestConfig } from 'axios';

enum Api {
  Quizz = '/quizzes',
  QuizzAll = '/quizzes/all',
  Question = '/questions',
  Answer = '/answers',
  Complete = '/quiz-attempts',
  SaveAnswer = '/quiz/save-answer',
  SubmitQuiz = '/quiz/submit',
  CountQuizCompleted = '/quiz/count',
  AnsweredQuestions = '/quiz/answered-questions',
  StartAttempt = '/quiz/start-attempt',
  UserAnswer = '/user-answers',
  QuizAttemptList = '/quiz-attempts/list',
  QuizAttemptAverage = '/quiz-attempts/stats/{userId}/{attemptId}',
  QuizAttemptFrequency = '/quiz-attempts/get-stats/{questionId}',
}

export const getQuizz = (params: any = {}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.QuizzAll,
    params,
  };
  return defHttp.get<any>(config);
};

export const getFirstQuizz = () => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Quizz,
  };
  return defHttp.get<any>(config);
};

export const getQuizzById = (id: string | number) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Quizz + '/' + id,
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

export const saveAnswer = (data: {
  attempt_id: number;
  quiz_id: number;
  question_id: number;
  score: number;
  answer_id: number;
}) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SaveAnswer,
    data: data,
  };
  return defHttp.post<any>(config);
};

export const submitQuiz = (params: { attempt_id: number | string }) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.SubmitQuiz,
    params,
  };
  return defHttp.post<any>(config);
};

export const countQuizComlete = (params?: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.CountQuizCompleted,
    params,
  };
  return defHttp.get<any>(config);
};

export const answeredQuestions = (params?: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.AnsweredQuestions,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const startAttemptApi = (params?: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.StartAttempt,
    params: params,
  };
  return defHttp.post<any>(config);
};

export const userAnswerApi = (params?: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.UserAnswer,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const getQuizAttemptListApi = (params?: any) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.QuizAttemptList,
    params: params,
  };
  return defHttp.get<any>(config);
};

export const getQuizAttemptById = (id: number | string) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: Api.Complete + '/' + id,
  };
  return defHttp.get<any>(config);
};

export const getQuizAttemptAverage = (userId: number | string, attemptId: number | string) => {
  const token: any = getToken();
  const config: AxiosRequestConfig<any> = {
    headers: getDefaultAxiosOption(token),
    url: String(Api.QuizAttemptAverage)
      .replace('{userId}', String(userId))
      .replace('{attemptId}', String(attemptId)),
  };
  return defHttp.get<any>(config);
};
