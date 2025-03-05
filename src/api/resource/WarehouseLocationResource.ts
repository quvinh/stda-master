import BaseResource from '@/api/resource/BaseResource';

export default class WarehouseLocationResource extends BaseResource {
  static override endpoint: string = '/v1/warehouse-locations';
}
