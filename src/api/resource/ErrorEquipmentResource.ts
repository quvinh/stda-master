import BaseResource from '@/api/resource/BaseResource';

export default class ErrorEquipmentResource extends BaseResource {
  static override endpoint: string = '/v1/error-equipments';
  static override labelKey: string = 'error_equipment_name';
}
