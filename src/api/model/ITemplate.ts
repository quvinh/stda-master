import { IBaseModel } from './IBaseModel';

export interface ITemplate extends IBaseModel {
  id: string;
  name: string;
  content: string;
  description?: string;
}
