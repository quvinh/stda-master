import BaseResource from '@/api/resource/BaseResource';

export default class EquipmentErrorLogResource extends BaseResource {
  static override endpoint: string = '/v1/error-equipment-logs';
}
