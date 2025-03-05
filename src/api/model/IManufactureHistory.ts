import { IBaseModel } from './IBaseModel';

export interface IManufactureHistory extends IBaseModel {
  batch_id: string;
  process_id: string;
  equipment_id: string;
  product_id: string;
  status: number;
  start_time: string;
  end_time: string;
  quantity: number;
  quantity_plan: number;
  quantity_ng: number;
  notes: string;
}
