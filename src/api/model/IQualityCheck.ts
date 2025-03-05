import { IBaseModel } from './IBaseModel';
import { IUser } from "@/api/model/IUser";

export interface IQualityCheck extends IBaseModel {
  id: string;
  qualitycheckable_id: string;
  qualitycheckable_type: string;
  step_id?: string | null;
  check_type?: string | null;
  start_time: string; // ISO 8601 formatted datetime
  end_time?: string | null; // ISO 8601 formatted datetime
  result: string;
  inspector_id: string;
  inspector?: IUser;
  remarks?: string | null;
}
