import { IBaseModel } from './IBaseModel';

export interface IDepartment extends IBaseModel {
  id: string;
  department_name: string;
  parent_id?: string;
}
