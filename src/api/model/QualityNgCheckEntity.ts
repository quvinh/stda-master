import { IBaseModel } from '@/api/model/IBaseModel';
import ILotHistory from '@/api/model/ILotHistory';
import IErrorQuality from '@/api/model/IErrorQuality';

export interface QualityNgCheckEntity extends IBaseModel {
  lot_history_id: ILotHistory['id'];
  error_quality_id: IErrorQuality['id'];
  quantity_ng: number;
}
