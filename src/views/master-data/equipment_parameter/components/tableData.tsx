import { BasicColumn, FormProps } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã thông số',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Mã máy',
      dataIndex: 'equipment_id',
      align: 'center',
      width: 150,
    },
    {
      title: 'Tên',
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
        label: `Mã thông số`,
        component: 'Input',
      },
      {
        field: `name`,
        label: `Tên thông số`,
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
