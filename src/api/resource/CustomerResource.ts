import BaseResource from '@/api/resource/BaseResource';

export default class CustomerResource extends BaseResource {
  static override endpoint: string = '/v1/customers';
}
