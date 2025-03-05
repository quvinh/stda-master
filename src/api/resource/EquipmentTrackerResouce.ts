import BaseResource from '@/api/resource/BaseResource';

export default class EquipmentTrackerResouce extends BaseResource {
  static override endpoint: string = '/v1/equipment-trackers';
}
