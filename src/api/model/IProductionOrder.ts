import { IBaseModel } from './IBaseModel';

export interface IProductionOrder extends IBaseModel {
  id: number;
  product_id: String;
  process_id: String;
  start_date: Date;
  end_date: Date;
  quantity: Number;
  status: String;
}
