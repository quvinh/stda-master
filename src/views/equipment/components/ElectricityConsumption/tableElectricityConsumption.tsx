import { BasicColumn } from '@/components/Table';

const fakeDates = () => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padEnd(2, '0');
    dates.unshift(`${day}/${month}`);
  }
  return dates;
};

export function getBasicColumns(): BasicColumn[] {
  const firstColumn: any = {
    title: '',
    dataIndex: 'title',
    align: 'left',
    fixed: 'left',
    width: 150,
  };
  const columns = fakeDates().map((date) => ({
    title: date,
    dataIndex: date.replace('/', '_'),
    align: 'left',
    width: 100,
  }));
  return [firstColumn, ...columns];
}

export function mockData(): any[] {
  // Lấy danh sách ngày được tạo bởi fakeDates
  const dates = fakeDates().map((item) => item.replace('/', '_'));

  // Tạo dữ liệu mẫu phù hợp với các ngày trong cột
  const data = [
    {
      title: 'Tổng điện năng (kW)',
      [dates[0]]: 200000.0,
      [dates[1]]: 210000.5,
      [dates[2]]: 220000.75,
      [dates[3]]: 230000.0,
      [dates[4]]: 240000.25,
      [dates[5]]: 265439.31,
      [dates[6]]: 265488.69,
    },
    {
      title: 'Số giờ',
      [dates[0]]: 24,
      [dates[1]]: 24,
      [dates[2]]: 24,
      [dates[3]]: 24,
      [dates[4]]: 24,
      [dates[5]]: 24,
      [dates[6]]: 24,
    },
    {
      title: 'TB điện năng tiêu thụ (kWh)',
      [dates[0]]: 8333.33,
      [dates[1]]: 8750.02,
      [dates[2]]: 9166.7,
      [dates[3]]: 9583.33,
      [dates[4]]: 10000.01,
      [dates[5]]: 11060.81,
      [dates[6]]: 11062.03,
    },
  ];

  return data;
}
