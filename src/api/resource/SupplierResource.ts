import BaseResource from '@/api/resource/BaseResource';

export default class SupplierResource extends BaseResource {
  static override endpoint: string = '/v1/suppliers';
  static override labelKey: string = 'supplier_name';
}
