import { IBaseModel } from '@/api/model/IBaseModel';
import ILot from '@/api/model/ILot';
import { IProduct } from '@/api/model/IProduct';

export default interface OiLotEntity extends IBaseModel {
  batch_code: ILot['batch_code'];
  lot_id: ILot['id'];
  product_id: IProduct['id'];
  product_name: IProduct['product_name'];
  po_quantity: number;
  planned_quantity: number;
  actual_quantity: number;
  ng_quantity: number; //
  planned_start_time: string;
  planned_end_time: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  status: string;
}
