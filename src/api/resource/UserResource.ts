import BaseResource from '@/api/resource/BaseResource';

export default class UserResource extends BaseResource {
  static override endpoint: string = '/v1/users';

  static override labelKey: string = 'name';
}
