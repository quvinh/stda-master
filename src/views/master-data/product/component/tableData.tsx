import { BasicColumn, FormProps } from '@/components/Table';
import { Tag } from 'ant-design-vue';

export const getBasicColumns = (): BasicColumn[] => {
  return [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 180,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      align: 'center',
      width: 230,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      align: 'center',
      width: 100,
      customRender: ({ value }) => value?.name,
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'product_category',
      align: 'center',
      width: 150,
      customRender: ({ value }) => value?.name,
    },
    {
      title: 'PQC',
      dataIndex: 'have_pqc',
      align: 'center',
      width: 80,
      customRender: ({ value }) => (
        <Tag color={value ? 'blue' : 'default'}>{value ? 'YES' : 'NO'}</Tag>
      ),
    },
  ];
};

export function getFormConfig(): Partial<FormProps> {
  return {
    // labelWidth: 120,
    layout: 'vertical',
    schemas: [
      {
        field: `id`,
        label: `Mã sản phẩm`,
        component: 'Input',
      },
      {
        field: `name`,
        label: `Tên sản phẩm`,
        component: 'Input',
      },
    ],
    submitButtonOptions: { preIcon: 'ant-design:search-outlined', iconSize: 16 },
  };
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
  };
}
