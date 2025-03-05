import { IBaseModel } from './IBaseModel';
import { IUnit } from '@/api/model/IUnit';
import { IProductCategory } from '@/api/model/IProductCategory';

export interface IProduct extends IBaseModel {
  id: string;
  product_name: string;
  unit_id: IUnit['id'];
  unit?: IUnit | null;
  product_category_id: string;
  have_pqc: boolean;
  product_category?: IProductCategory | null;
}
