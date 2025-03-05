import ApiResponse, { DefaultResourceResponse } from '@/api/ApiResponse';
import axiosInstance from '@/api/resource/axiosInstance';
import { ISelectOption } from '@/store/types/pagination';

export default class BaseResource {
  static endpoint: string = '/default-endpoint'; // Set a default endpoint if needed

  static labelKey: string = 'id';

  static getAll<T>(query?: unknown): Promise<ApiResponse<DefaultResourceResponse<T>>> {
    return axiosInstance.get(this.endpoint, { params: query });
  }

  static getById<T>(id: string | number): Promise<ApiResponse<T>> {
    return axiosInstance.get(`${this.endpoint}/${id}`);
  }

  static async getOptions<T = object>(): Promise<ISelectOption[]> {
    const entities = axiosInstance.get(this.endpoint, { params: { pageSize: 10000 } });
    const response = await entities;
    return response.data.data.map((entity: T) => ({
      label: String(entity[this.labelKey]),
      value: entity['id'] as string | number,
    }));
  }

  static create<T>(data: unknown): Promise<ApiResponse<T>> {
    return axiosInstance.post(this.endpoint, data);
  }

  static update<T>(id: string | number, data: unknown): Promise<ApiResponse<T>> {
    return axiosInstance.put(`${this.endpoint}/${id}`, data);
  }

  static delete(id: string | number): Promise<ApiResponse> {
    return axiosInstance.delete(`${this.endpoint}/${id}`);
  }
}
