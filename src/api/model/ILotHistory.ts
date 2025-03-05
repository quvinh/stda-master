import { IBaseModel } from '@/api/model/IBaseModel';
import { IProduct } from '@/api/model/IProduct';
import { IProductionPlan } from '@/api/model/IProductionPlan';
import { IEquipment } from '@/api/model/IEquipment';
import { IProcess } from '@/api/model/IProcess';
import ILot from '@/api/model/ILot';
import { IQualityCheck } from '@/api/model/IQualityCheck';
import ILotPlan from '@/api/model/ILotPlan';
import { IMold } from './IMold';

interface ILotHistory extends IBaseModel {
  id: string;
  lot_id: ILot['id'];
  process_id: IProcess['id'] | null;
  equipment_id: IEquipment['id'];
  batch_code: string;
  production_plan_id: IProductionPlan['id'];
  product_id: IProduct['id'];
  status: string;
  quantity: number;
  fai_quantity: number;
  reuse_ng_quantity: number;
  unrepairable_ng_quantity: number;
  quantity_ng: number;
  start_time: string;
  end_time: string;
  notes: string;
  lot?: ILot;
  product?: IProduct;
  production_plan?: IProductionPlan;
  equipment?: IEquipment;
  process?: IProcess | null;
  quality_checks?: IQualityCheck[];
  lot_plan?: ILotPlan;
  input_die_id: IMold['id'];
}

export default ILotHistory;
