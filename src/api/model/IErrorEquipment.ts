import { IBaseModel } from './IBaseModel';

export interface IErrorEquipment extends IBaseModel {
  id: string;
  error_equipment_name: string;
  equipment_id: string;
  reason?: string;
  fix?: string;
  protection_measures?: string;
}
