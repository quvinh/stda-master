import { IBaseModel } from './IBaseModel';

export interface IEquipment extends IBaseModel {
  id: string;
  equipment_name: string;
  equipment_code: string;
  process_id: string;
  iot_signal: boolean;
}
