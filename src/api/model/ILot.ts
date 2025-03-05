import { IBaseModel } from './IBaseModel';
import { IProductionPlan } from '@/api/model/IProductionPlan';
import { IProduct } from '@/api/model/IProduct';
import { IEquipment } from '@/api/model/IEquipment';
import { IProcess } from '@/api/model/IProcess';
import { IBoms } from '@/api/model/IBoms';
import ILotPlan from '@/api/model/ILotPlan';

enum LotStatus {
  WAITING_FOR_FAI = 'waiting_for_fai',
  PENDING = 'pending',
  PRODUCING = 'producing',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

interface ILot extends IBaseModel {
  id: string;
  batch_code: string;
  production_plan_id: IProductionPlan['id'];
  product_id: IProduct['id'];
  equipment_id?: IEquipment['id'];
  equipment?: IEquipment;
  process_id?: IProcess['id'];
  actual_quantity: number;
  status: LotStatus;
  bom?: IBoms[];
  lot_plan?: ILotPlan;
  material_id?: string;
}

export default ILot;
