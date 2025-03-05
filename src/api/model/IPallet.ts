import { IBaseModel } from './IBaseModel';
import { IMaterial } from '@/api/model/IMaterial';
import { IUnit } from '@/api/model/IUnit';
import MaterialReceiptItemEntity from '@/api/model/MaterialReceiptItemEntity';
import { IQualityCheck } from '@/api/model/IQualityCheck';

export interface IPallet extends IBaseModel {
  id: string;
  parent_id: string;
  material_receipt_id: MaterialReceiptItemEntity['id'];
  material_receipt_item?: MaterialReceiptItemEntity | null;
  material_name: string;
  material_id: string;
  material?: IMaterial | null;
  quality_checks: IQualityCheck[];
  lot_no: string;
  quantity_1: number;
  unit_id_1: string;
  unit1?: IUnit | null;
  quantity_2: number;
  unit_id_2: string;
  unit2?: IUnit | null;
  note: string;
  is_separated: number;
  created_at: string;
  updated_at: string;
  material_export_item?: any; // type need fix
}
