import BaseResource from '@/api/resource/BaseResource';

export default class ErrorQualityResource extends BaseResource {
  static override endpoint: string = '/v1/error-qualities';
}
