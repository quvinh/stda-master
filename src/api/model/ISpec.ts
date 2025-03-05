import { IProduct } from '@/api/model/IProduct';
import { IProcess } from '@/api/model/IProcess';
import { IEquipment } from '@/api/model/IEquipment';
import { IBaseModel } from '@/api/model/IBaseModel';
import IAttribute from '@/api/model/IAttribute';
import ISpecAttributeValue from '@/api/model/ISpecAttributeValue';

export default interface ISpec extends IBaseModel {
  id: number;
  product_id: IProduct['id'];
  process_id: IProcess['id'];
  equipment_id: IEquipment['id'];
  operation: string;
  attributes?: IAttribute[];
  attribute_values?: ISpecAttributeValue[];
}
