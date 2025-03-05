import { IBaseModel } from "@/api/model/IBaseModel";
import { IEquipment } from "@/api/model/IEquipment";
import ILot from "@/api/model/ILot";

export default interface EquipmentTrackerEntity extends IBaseModel{
  equipment_id: IEquipment['id'];
  lot_id: ILot['id'];
  equipment?: IEquipment;
  lot?: ILot;
}