import { IBaseModel } from './IBaseModel';

export interface IProductCategory extends IBaseModel {
  id: number;
  product_category_name: string;
}
