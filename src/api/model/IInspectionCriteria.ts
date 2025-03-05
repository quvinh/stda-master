import { IBaseModel } from './IBaseModel';

export interface IInspectionCriteria extends IBaseModel {
  id: number;
  criteria_name: string;
  description?: string;
}
