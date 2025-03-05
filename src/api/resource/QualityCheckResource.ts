import BaseResource from '@/api/resource/BaseResource';
import ApiResponse, { ResourceReponse } from "@/api/ApiResponse";
import ILotHistory from "@/api/model/ILotHistory";
import axiosInstance from "@/api/resource/axiosInstance";

export default class QualityCheckResource extends BaseResource {
  static override endpoint: string = '/v1/qc';

  static getFaiHistories = (param: unknown): Promise<ResourceReponse<ILotHistory>> => {
    return axiosInstance.get(`v1/qc/ui/fai-histories`, { params: param });
  };
}
