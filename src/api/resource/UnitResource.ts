import BaseResource from '@/api/resource/BaseResource';

export default class UnitResource extends BaseResource {
  static override endpoint: string = 'v1/units';

  static override labelKey: string = 'name';
}
