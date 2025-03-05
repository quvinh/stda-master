import { IBaseModel } from '@/api/model/IBaseModel';

export default interface UserEntity extends IBaseModel {
  id: number;
  name: string;
  email: string | null;
  username: string;
  access_token: string | null;
  email_verified_at: string | null;
  password: string;
  rememberToken: string | null;
}
