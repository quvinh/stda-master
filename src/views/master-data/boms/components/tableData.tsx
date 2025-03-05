import { BasicColumn, FormProps } from '@/components/Table';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã Bom',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: 120,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      align: 'center',
      width: 150,
      customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      align: 'center',
      width: 150,
      customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    layout: 'vertical',
    schemas: [
      {
        field: `id`,
        label: `Mã Bom`,
        component: 'Input',
        componentProps: {
          allowClear: true,
        },
      },
      {
        field: `product_id`,
        label: `Mã sản phẩm`,
        component: 'Input',
        componentProps: {
          allowClear: true,
        },
      },
      {
        field: `description`,
        label: `Mô tả`,
        component: 'Input',
        componentProps: {
          allowClear: true,
        },
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
