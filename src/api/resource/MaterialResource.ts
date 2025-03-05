import BaseResource from '@/api/resource/BaseResource';

export default class MaterialResource extends BaseResource {
  static override endpoint: string = '/v1/materials';
  static override labelKey: string = 'name';
}
