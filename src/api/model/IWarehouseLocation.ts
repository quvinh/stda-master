import { IBaseModel } from './IBaseModel';

export interface IWarehouseLocation extends IBaseModel {
  id: string;
  warehouse_id: string;
  location_type: string;
  capacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
