import { IBaseModel } from './IBaseModel';

export interface ISemiFinishedProduct extends IBaseModel {
  id: string;
  material_name: string;
  mi: string;
  type: string;
  class: string;
  material_category_id: string;
  unit_id: number;
}
