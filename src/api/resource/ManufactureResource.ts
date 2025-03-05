import BaseResource from '@/api/resource/BaseResource';
import axiosInstance from '@/api/resource/axiosInstance';
import ApiResponse from '@/api/ApiResponse';

export default class ManufactureResource extends BaseResource {
  static override endpoint: string = '/v1/manufacture';

  static mappingOiManufactureLot = (param: unknown): Promise<ApiResponse> => {
    return axiosInstance.post('/v1/manufacture/mapping-oi-manufacture', param);
  };

  static updateNgQuantity = (lotId: string, ng_quantity: number): Promise<ApiResponse> => {
    return axiosInstance.put(`/v1/manufacture/update-ng-quantity`, { lotId, ng_quantity });
  };
}
