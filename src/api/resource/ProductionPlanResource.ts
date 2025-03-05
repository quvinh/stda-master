import BaseResource from '@/api/resource/BaseResource';
import axiosInstance from '@/api/resource/axiosInstance';
import ApiResponse from "@/api/ApiResponse";

export default class ProductionPlanResource extends BaseResource {
  static override endpoint: string = 'v1/production-plans';

  static getBatchCodes = async (): Promise<ApiResponse<string[]>> => {
    return await axiosInstance.get('v1/manufacture/get-batch-codes');
  };
}
