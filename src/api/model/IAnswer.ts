import { IBaseModel } from './IBaseModel';

export interface IAnswer extends IBaseModel {
  id: number;
  answer_text: string;
  question_id: number;
  is_correct: number;
}
