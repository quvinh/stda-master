import { IBaseModel } from '@/api/model/IBaseModel';

export default interface EquipmentStopErrorHistoryEntity extends IBaseModel {
  equipment_id: string;
  error_equipment_id: string;
  lot_id: string;
  stop_time: string;
  end_time: string;
  handler_id: number;
  batch_code: string;
}
