import { IBaseModel } from '@/api/model/IBaseModel';
import ISpec from '@/api/model/ISpec';
import IAttribute from '@/api/model/IAttribute';

export default interface ISpecAttributeValue extends IBaseModel {
  id: number;
  spec_id: ISpec['id'];
  attribute_id: IAttribute['id'];
  value: string;
}
