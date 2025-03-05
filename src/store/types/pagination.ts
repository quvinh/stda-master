export interface IPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export interface ISelectOption {
  label: string;
  value: string | number;
}
