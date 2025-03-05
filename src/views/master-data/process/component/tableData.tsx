import { BasicColumn, FormProps } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã công đoạn',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Công đoạn',
      dataIndex: 'name',
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
        label: `Mã công đoạn`,
        component: 'Input',
      },
      {
        field: `name`,
        label: `Công đoạn`,
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
