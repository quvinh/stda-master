import { IBaseModel } from './IBaseModel';

export interface IFinishedProductExport extends IBaseModel {
  id: number;
  finished_product_export_id: string;
  lot_id: string;
  product_id: string;
  quantity: number;
  unit: string;
  note: string;
  created_at: string;
  updated_at: string;
}
