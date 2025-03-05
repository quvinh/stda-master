import BaseResource from '@/api/resource/BaseResource';

export default class EquipmentParameterLogResource extends BaseResource {
  static override endpoint: string = '/v1/equipment-parameter-logs';
}
