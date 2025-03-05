import { BasicColumn } from '@/components/Table';
import { Tag } from 'ant-design-vue';

export function getColumnsTop(): BasicColumn[] {
  return [
    {
      title: 'Tổng số khuôn',
      dataIndex: 'total',
      align: 'right',
      width: 300,
    },
    {
      title: 'Số lượng lưu kho',
      dataIndex: 'in_warehouse',
      align: 'right',
      width: 300,
    },
    {
      title: 'Số khuôn đang chạy',
      dataIndex: 'running_molds',
      align: 'right',
      width: 300,
    },
  ];
}

export function mockDataTop(): any[] {
  return [
    {
      totalMoldsStopped: 10,
      totalMoldsRunning: 15,
      totalMoldsInStorage: 25,
    },
  ];
}

export function getColumnsMiddle(): BasicColumn[] {
  return [
    { title: 'ID', dataIndex: 'id', align: 'center', fixed: 'left', width: 100 },
    { title: 'Tên khuôn', dataIndex: 'mold_name', align: 'center', width: 100 },
    { title: 'Vị trí', dataIndex: 'location', align: 'center', width: 100 },
    {
      title: 'Tuổi thọ',
      dataIndex: 'current_lifespan',
      align: 'right',
      fixed: 'right',
      width: 100,
      customRender: ({ value }) => (!isNaN(value) ? `${Number(value)}%` : ''),
    },
    {
      title: 'Tình trạng khuôn',
      dataIndex: 'running',
      align: 'center',
      fixed: 'right',
      width: 120,
      customRender: ({ record }) => {
        const { location } = record;
        return location == 'KH1-10' ? (
          <Tag color="red">OFF</Tag>
        ) : (
          <Tag color="green">ON</Tag>
        );
      },
    },
  ];
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
  };
}

export function mockDataMiddle(): any[] {
  return [
    {
      mold_id: '233169',
      width: 2.3,
      height: 15.9,
      side: 2.3,
      mold_name: 'nhãn đồng tiền',
      market: '',
      production_date: '4/10/2022',
      location: '',
      cutting_stroke: '',
      notes: '',
    },
    {
      mold_id: '24088296',
      width: 2.7,
      height: 4.5,
      side: 1.6,
      mold_name: '9 con',
      market: '',
      production_date: '',
      location: '',
      cutting_stroke: '',
      notes: '',
    },
    {
      mold_id: '71357',
      width: 2.8,
      height: 4.2,
      side: 1.2,
      mold_name: 'tròn 6 con',
      market: '',
      production_date: '8/9/2022',
      location: '',
      cutting_stroke: '',
      notes: '',
    },
    {
      mold_id: '24141549',
      width: 2.9,
      height: 2.9,
      side: 8.8,
      mold_name: 'sin su',
      market: '',
      production_date: '15/5/2024',
      location: '',
      cutting_stroke: '',
      notes: '',
    },
    {
      mold_id: '238768',
      width: 3,
      height: 4,
      side: 1.3,
      mold_name: 'tag',
      market: '',
      production_date: '7/4/2023',
      location: '',
      cutting_stroke: '',
      notes: '',
    },
    {
      mold_id: '239689',
      width: 3,
      height: 4,
      side: 1.3,
      mold_name: 'tag',
      market: '',
      production_date: '13/8/2024',
      location: '',
      cutting_stroke: '',
      notes: '',
    },
    {
      mold_id: '243615',
      width: 3,
      height: 5,
      side: 1.8,
      mold_name: 'tag',
      market: '',
      production_date: '26/11/2022',
      location: '',
      cutting_stroke: '',
      notes: '',
    },
    {
      mold_id: '246854',
      width: 3,
      height: 5,
      side: 1.8,
      mold_name: 'tag tròn 3 con',
      market: '',
      production_date: '29/11/2022',
      location: '',
      cutting_stroke: '',
      notes: '',
    },
  ];
}
