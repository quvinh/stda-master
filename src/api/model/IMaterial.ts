import { IBaseModel } from './IBaseModel';

export interface IMaterial extends IBaseModel {
  id: string;
  name: string;
  mi: string;
  type: string;
  class: string;
  material_category_id: string;
  unit_id: number;
}
