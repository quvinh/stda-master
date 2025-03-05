export interface GrowCardItem {
  icon: string;
  title: string;
  value: number;
  total: number;
  color: string | undefined;
  action: string;
}

export const growCardList: GrowCardItem[] = [
  {
    title: 'Tỷ lệ thực thi SoP',
    icon: 'total-sales|svg',
    value: 98.7,
    total: 95,
    color: undefined,
    action: 'Chi tiết',
  },
  {
    title: 'Tỷ lệ OEE',
    icon: 'gauge|svg',
    value: 54.5,
    total: 75,
    color: undefined,
    action: 'Chi tiết',
  },
  {
    title: 'Tỷ lệ RTY',
    icon: 'bar-chart-1|svg',
    value: 98.95,
    total: 98,
    color: undefined,
    action: 'Chi tiết',
  },
  {
    title: 'Tỉ lệ tồn kho BTP',
    icon: 'bar-chart-2|svg',
    value: 8.03,
    total: 5,
    color: undefined,
    action: 'Chi tiết',
  },
];
