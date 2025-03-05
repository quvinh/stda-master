import { BasicColumn } from '@/components/Table';
import { Tag } from 'ant-design-vue';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Loại',
      dataIndex: 'type',
      fixed: 'left',
      width: 100,
      customRender: ({ value }) => {
        switch (value) {
          case 'import':
            return <Tag color="#ff5500">NHẬP</Tag>;
          case 'export':
            return <Tag color="#2db7f5">XUẤT</Tag>;
          default:
            return '-';
        }
      },
    },
    {
      title: 'Vị trí',
      dataIndex: 'warehouse_location_id',
      align: 'left',
      width: 100,
    },
    {
      title: 'Mã Lot',
      dataIndex: 'warehousehistoryable_id',
      align: 'left',
      width: 150,
    },
    {
      title: 'Mã thành phẩm',
      dataIndex: 'product_id',
      align: 'left',
      width: 150,
      customRender: ({ record }) => record?.lot?.product_id,
    },
    {
      title: 'Tên thành phẩm',
      dataIndex: 'product_name',
      align: 'left',
      width: 250,
      customRender: ({ record }) => record?.lot?.product?.product_name,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'right',
      width: 100,
      customRender: ({ value }) => Number(value),
    },
    // {
    //   title: 'Tồn', // Tồn lũy kế
    //   dataIndex: 'inventory_quantity',
    //   width: 150,
    // },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit_name',
      align: 'left',
      width: 100,
      customRender: ({ record }) => record?.unit?.unit_name,
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      align: 'right',
      width: 100,
    },
    {
      title: 'Người tạo',
      dataIndex: 'created_by',
      align: 'left',
      width: 100,
      customRender: ({ record }) => record?.created_by?.name,
    },
  ];
}

export function getInventoryColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã TP',
      dataIndex: 'product_id',
      align: 'left',
      width: 100,
    },
    {
      title: 'Tên thành phẩm',
      dataIndex: 'product_name',
      align: 'left',
      width: 250,
    },
    {
      title: 'Số lượng',
      dataIndex: 'total_quantity',
      align: 'right',
      width: 100,
      customRender: ({ value }) => Number(value),
    },
    {
      title: 'Đơn vị tính',
      align: 'left',
      dataIndex: 'unit_name',
      width: 100,
    },
  ];
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
  };
}
