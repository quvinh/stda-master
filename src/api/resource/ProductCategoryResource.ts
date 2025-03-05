import BaseResource from '@/api/resource/BaseResource';

export default class ProductCategoryResource extends BaseResource {
  static override endpoint: string = 'v1/product-categories';

  static override labelKey: string = 'product_category_name';
}
