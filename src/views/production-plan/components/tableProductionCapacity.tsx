import { BasicColumn, FormProps } from '@/components/Table';

export const getBasicColumns = (): BasicColumn[] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      align: 'center',
      width: 100,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product_name',
      align: 'center',
      width: 230,
    },
    {
      title: 'Công đọan',
      dataIndex: 'process_name',
      align: 'center',
      width: 100,
    },
    {
      title: 'Máy',
      dataIndex: 'equipment_name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Thời gian vận chuyển',
      dataIndex: 'transport_time',
      align: 'center',
      width: 150,
    },
    {
      title: 'Thời gian chuẩn bị',
      dataIndex: 'preparation_time',
      align: 'center',
      width: 150,
    },
    {
      title: 'QC Time',
      dataIndex: 'qc_time',
      align: 'center',
      width: 150,
    },
    {
      title: 'Cycle Time',
      dataIndex: 'cycle_time',
      align: 'center',
      width: 150,
    },
  ];
};

export function getFormConfig(): Partial<FormProps> {
  return {
    layout: 'vertical',
    schemas: [
      {
        field: `id`,
        label: `ID`,
        component: 'Input',
      },
      {
        field: `name`,
        label: `Tên phòng ban`,
        component: 'Input',
      },
    ],
  };
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
  };
}
