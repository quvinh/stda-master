import { IBaseModel } from '@/api/model/IBaseModel';
import { IMaterial } from '@/api/model/IMaterial';
import { ISupplier } from '@/api/model/ISupplier';
import { IUnit } from '@/api/model/IUnit';
import { IQualityCheck } from "@/api/model/IQualityCheck";

export default interface MaterialReceiptItemEntity extends IBaseModel {
  id: number;
  material_receipt_id: string;
  material_id: IMaterial['id'];
  material?: IMaterial | null;
  packing: string | null;
  quantity_1: number;
  quantity_2: number;
  unit1?: IUnit | null;
  unit2?: IUnit | null;
  unit_id_1: number | null;
  unit_id_2: number | null;
  supplier_id: ISupplier['id'];
  supplier?: ISupplier | null;
  note: string | null;
  quality_checks?: IQualityCheck[];
}
