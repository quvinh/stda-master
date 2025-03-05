export default interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message: string;
}

interface ExportData {
  data: string;
  type: string;
  file: string;
}

export interface ResourceReponse<T = unknown> {
  data: T[];
  pagination: null | {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface DefaultResourceResponse<T = unknown> {
  data: T[];
  pagination: null | {
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
}

export interface ExportApiResponse extends ApiResponse<ExportData> {}
