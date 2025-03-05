import { IBaseModel } from '@/api/model/IBaseModel';
import { IEquipment } from '@/api/model/IEquipment';
import { IErrorEquipment } from '@/api/model/IErrorEquipment';

export default interface EquipmentErrorLogEntity extends IBaseModel {
  id: number;
  equipment_id: IEquipment['id'];
  equipment?: IEquipment;
  error_equipment_id: IErrorEquipment['id'];
  equipment_error?: IErrorEquipment;
  stop_time: string;
  start_time: string | null;
  handle_time: string | null;
  handler_id: number | null;
}
