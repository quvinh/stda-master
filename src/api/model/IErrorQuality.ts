import { IBaseModel } from './IBaseModel';

export default interface IErrorQuality extends IBaseModel {
  id: string;
  error_quality_name: string;
  process_id: string;
  description: string;
}
