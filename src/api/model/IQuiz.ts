import { IBaseModel } from './IBaseModel';

export interface IQuiz extends IBaseModel {
  id: number;
  title: string;
  description: number;
  is_published: number;
  user_id: number;
  image: string;
}
