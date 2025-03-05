import { IBaseModel } from './IBaseModel';

export interface ICT_TTManagement extends IBaseModel {
  id: number;
  batch_id: string;
  equipment_id?: string;
  status?: string;
  quantity: number;
  quantity_ng?: number;
  start_time?: string;
  end_time?: string;
  notes?: string;
  customer_id?: string;
  product_id?: string;
  product_name?: string;
  order_id?: string;
}
