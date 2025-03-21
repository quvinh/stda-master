import { IBaseModel } from './IBaseModel';

export interface IQuestion extends IBaseModel {
  id: number;
  question_name: string;
  quiz_id: number;
  question_type: number;
  image: string;
}
