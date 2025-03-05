import BaseResource from '@/api/resource/BaseResource';

export default class ProductResource extends BaseResource {
  static override endpoint: string = '/v1/products';

  static override labelKey: string = 'name';
}
