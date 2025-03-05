import BaseResource from '@/api/resource/BaseResource';

export default class ProcessResource extends BaseResource {
  static override endpoint: string = 'v1/processes';
}
