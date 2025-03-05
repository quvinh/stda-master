import BaseResource from '@/api/resource/BaseResource';
import axiosInstance from '@/api/resource/axiosInstance';
import ApiResponse from '@/api/ApiResponse';
import ILotHistory from '@/api/model/ILotHistory';

export default class QualityNgCheckResource extends BaseResource {
  static override endpoint: string = '/v1/quality-ng-checks';
}
