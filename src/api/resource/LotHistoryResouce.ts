import BaseResource from '@/api/resource/BaseResource';

export default class LotHistoryResouce extends BaseResource {
  static override endpoint: string = '/v1/lot-histories';
}
