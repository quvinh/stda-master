import { IBaseModel } from './IBaseModel';

export interface IApplicationSetting extends IBaseModel {
  id: string | number;
  name: string;
  setting_type: 'boolean' | 'option' | 'string';
  boolean_value: boolean;
  options: string | string[];
}
