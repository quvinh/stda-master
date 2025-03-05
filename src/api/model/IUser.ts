import { IBaseModel } from './IBaseModel';

export interface IUser extends IBaseModel {
  id: string;
  name: string;
  email?: string | null; // Nullable email
  username: string; // Unique username
  access_token?: string | null; // Nullable access token
  email_verified_at?: string | null; // ISO 8601 formatted timestamp for verification
  password: string; // Hashed password
  remember_token?: string | null; // Nullable token for "remember me" functionality
}
