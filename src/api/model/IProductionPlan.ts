import { IBaseModel } from './IBaseModel';
import { IProductionOrder } from '@/api/model/IProductionOrder';
import { IProduct } from '@/api/model/IProduct';
import { ICustomer } from '@/api/model/ICustomer';
import { IEquipment } from '@/api/model/IEquipment';
import ILot from '@/api/model/ILot';

type ProductionPlanStatus = 'pending' | 'producing' | 'completed' | 'paused' | 'cancelled';

export interface IProductionPlan extends IBaseModel {
  id: string;
  start_time: string;
  end_time: string;
  equipment_id: IEquipment['id'];
  production_order_id: IProductionOrder['id'];
  customer_id: ICustomer['id'];
  product_id: IProduct['id'];
  product?: IProduct;
  batch_code: string;
  quantity: number;
  status: ProductionPlanStatus;
  note: string;
  lots?: ILot[];
}
