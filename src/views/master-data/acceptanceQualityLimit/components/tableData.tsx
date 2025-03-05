import { BasicColumn, FormProps } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product_name',
      align: 'left',
      width: 150,
    },
    {
      title: 'SL bốc mẫu(%)',
      dataIndex: 'sampling_quantity',
      align: 'left',
      width: 150,
    },
    {
      title: 'Tiêu chuẩn',
      dataIndex: 'standard',
      align: 'left',
      width: 150,
    },
    {
      title: 'Standard code',
      dataIndex: 'standard_code',
      align: 'left',
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
        label: `ID`,
        component: 'Input',
      },
      {
        field: `product_name`,
        label: `Sản phẩm`,
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
