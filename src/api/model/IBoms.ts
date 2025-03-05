import { IBaseModel } from './IBaseModel';
import { IProduct } from '@/api/model/IProduct';
import { IProcess } from '@/api/model/IProcess';
import { IMaterial } from '@/api/model/IMaterial';

export interface IBoms extends IBaseModel {
  id: string;
  product_id: IProduct['id'];
  process_id: IProcess['id'];
  component_id: IMaterial['id'];
  component_description: string;
  parent_component_id: IMaterial['id'];
  parent_component_description: string;
  unit_id: number;
  order: number;
  loss_factor: number;
}
