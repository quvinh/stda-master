import { IBaseModel } from './IBaseModel';

export interface IEquipmentMaintenancePlan extends IBaseModel {
  id: string;
  equipment_id: string;
  equipment_name: string;
  plan_code: string;
  maintenance_type: string;
  using_unit: string;
  maintenance_date: string;
  maintenance_unit: string;
  user_id: string;
  notes: string;
  explain: string;
  start_time: string;
  end_time: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
