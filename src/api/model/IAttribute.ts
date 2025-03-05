import { IBaseModel } from '@/api/model/IBaseModel';

export default interface IAttribute extends IBaseModel {
  id: number;
  name: string;
  plural_name: string;
  display_name: string;
  attribute_type: 'string' | 'boolean' | 'integer' | 'decimal';
  model_class: string;
  default_value: string;
  is_required: boolean;
  display_order: number;
}
