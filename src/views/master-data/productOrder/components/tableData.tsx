import { BasicColumn, FormProps } from '@/components/Table';

export const getBasicColumns = (): BasicColumn[] => {
  return [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 180,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product_id',
      align: 'center',
      fixed: 'left',
      width: 180,
    },
    {
      title: 'Quy trình',
      dataIndex: 'process_id',
      align: 'center',
      width: 180,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      align: 'center',
      width: 180,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      align: 'center',
      width: 180,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'right',
      width: 180,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      width: 180,
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
        label: `Mã đơn hàng`,
        component: 'Input',
      },
      {
        field: `name`,
        label: `Tên sản phẩm`,
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
