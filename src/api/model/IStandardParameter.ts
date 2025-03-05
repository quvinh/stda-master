import { IBaseModel } from './IBaseModel';

export interface IStandardParameter extends IBaseModel {
  id: number;
  equipment_parameter_id: string;
  equipment_id: string;
  standard: number;
  standard_max: number;
  standard_min: number;
}
