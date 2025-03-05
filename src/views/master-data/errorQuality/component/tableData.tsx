import { BasicColumn, FormProps } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã lỗi',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Tên lỗi',
      dataIndex: 'name',
      align: 'center',
      width: 120,
    },
    {
      title: 'Công đoạn',
      dataIndex: 'process',
      align: 'center',
      width: 100,
      customRender: ({ record }) => record?.process?.name,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: 150,
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
        label: `Mã lỗi`,
        component: 'Input',
      },
      {
        field: `name`,
        label: `Tên lỗi`,
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
