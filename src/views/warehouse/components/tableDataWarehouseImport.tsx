import { BasicColumn } from '@/components/Table';
import { formatNumber } from '@/utils/helper/tsxHelper';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã phiếu nhập',
      dataIndex: 'receipt_id',
      width: 120,
      align: 'center',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 100,
      align: 'right',
      customRender: ({ record }) =>
        record?.items
          ? formatNumber(
              record?.items?.reduce(
                (a, b) => a + Number(b?.quantity_1 ? b?.quantity_1 : b?.quantity),
                0,
              ),
            )
          : '',
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      width: 100,
      align: 'center',
      customRender: ({ record }) => record?.items[0]?.unit1?.unit_name,
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'date_of_receipt',
      width: 100,
      align: 'center',
    },
    {
      title: 'Người nhập',
      dataIndex: 'entered_by',
      width: 100,
      align: 'center',
    },
  ];
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
    fixed: 'right',
  };
}

export function mockData(): any[] {
  return [
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      receipt_id: '2409001',
      date_of_receipt: '17/09/2024',
      entered_by: 'Admin',
    },
  ];
}
