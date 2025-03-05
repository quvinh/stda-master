import { IBaseModel } from './IBaseModel';

export interface IIQC extends IBaseModel {
  id: number;
  material_receipt_id: string;
  material_name: string;
  material_id: string;
  packing: string;
  quantity: number;
  supplier_id: string;
  note: string;
  status: string;
  created_at: string;
  updated_at: string;
}
