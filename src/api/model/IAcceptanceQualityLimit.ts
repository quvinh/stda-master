import { IBaseModel } from './IBaseModel';

export interface IAcceptanceQualityLimit extends IBaseModel {
  id: string;
  product_quantity_to?: number;
  product_quantity_from?: number;
  sampling_quantity?: number;
  standard?: number;
  standard_code?: string;
  product_name?: string;
}
