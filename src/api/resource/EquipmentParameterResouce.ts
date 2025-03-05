import BaseResource from '@/api/resource/BaseResource';

export default class EquipmentParameterResouce extends BaseResource {
  static override endpoint: string = '/v1/equipment-parameters';

  static override labelKey: string = 'parameter_name';
}
