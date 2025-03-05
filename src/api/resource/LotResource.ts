import BaseResource from '@/api/resource/BaseResource';

export default class LotResource extends BaseResource {
  static override endpoint: string = '/v1/lots';
}
