import BaseResource from '@/api/resource/BaseResource';

export default class AttributeResource extends BaseResource {
  static override endpoint: string = '/v1/attributes';
}
