import { IBaseModel } from '@/api/model/IBaseModel';
import { IProductionPlan } from '@/api/model/IProductionPlan';
import { IProduct } from '@/api/model/IProduct';
import ILot from '@/api/model/ILot';

interface ILotPlan extends IBaseModel {
  id: string;
  lot_id: ILot['id'];
  batch_code: string;
  product_id: IProduct['id'];
  production_plan_id: IProductionPlan['id'];
  lot_size: number;
  quantity: number;
  start_time: string;
  end_time: string;
  sequence_number: number;
}

export default ILotPlan;
