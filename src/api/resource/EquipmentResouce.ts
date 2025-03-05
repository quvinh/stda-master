import BaseResource from '@/api/resource/BaseResource';

export default class EquipmentResouce extends BaseResource {
  static override endpoint: string = 'v1/equipments';
  static override labelKey: string = 'name';
}
