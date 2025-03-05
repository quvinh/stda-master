import { BasicColumn } from '@/components/Table';
import { formatNumber } from '@/utils/helper/tsxHelper';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã phiếu nhập',
      dataIndex: 'receipt_id',
      width: 200,
      align: 'left',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 90,
      align: 'right',
      customRender: ({ record }) =>
        record?.items
          ? formatNumber(record?.items?.reduce((a, b) => a + Number(b?.quantity_1), 0))
          : '',
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'date_of_receipt',
      width: 200,
      align: 'left',
    },
    {
      title: 'Người nhập',
      dataIndex: 'entered_by',
      width: 100,
      align: 'left',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      width: 100,
    },
  ];
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Hành động',
    dataIndex: 'action',
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
