import { IBaseModel } from './IBaseModel';

type Spareparts = {
  stt: number;
  sparepartsName: string;
  quantity: number;
};

export interface IEquipmentMaintenanceHistories extends IBaseModel {
  id: string;
  maintenanceDate: string;
  maintenanceId: string;
  equipmentName: string;
  maintenanceUnit: string;
  maintenanceCategory: string;
  maintenanceContent: string;
  explain: string;
  maintenanceUser: string;
  maintenanceTime: string;
  spareparts: Spareparts[];
}
