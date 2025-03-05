import { BasicColumn, FormProps } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã lỗi',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Tên lỗi',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Mã máy',
      dataIndex: 'equipment_id',
      align: 'center',
      width: 150,
    },
    {
      title: 'Nguyên nhân',
      dataIndex: 'reason',
      align: 'center',
      width: 150,
    },
    {
      title: 'Cách khắc phục',
      dataIndex: 'fix',
      align: 'center',
      width: 150,
    },
    {
      title: 'Phòng ngừa',
      dataIndex: 'protection_measures',
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
