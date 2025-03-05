import { BasicColumn, FormProps } from '@/components/Table';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   fixed: 'left',
    //   width: 200,
    // },
    {
      title: 'Đơn vị tính',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      align: 'center',
      width: 120,
      customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    // labelWidth: 120,
    layout: 'vertical',
    schemas: [
      {
        field: `id`,
        label: `Mã đơn vị tính`,
        component: 'Input',
      },
      {
        field: `unit_name`,
        label: `Đơn vị tính`,
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
