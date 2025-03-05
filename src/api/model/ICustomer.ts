import { IBaseModel } from './IBaseModel';

export interface ICustomer extends IBaseModel {
  id: string;
  customer_name: string;
  phone?: string;
  email?: string;
  address?: string;
}
