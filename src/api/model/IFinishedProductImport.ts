import { IBaseModel } from './IBaseModel';

export interface IFinishedProductImport extends IBaseModel {
  id: number;
  finished_product_import_id: string;
  product_id: string;
  quantity: number;
  customer_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}
