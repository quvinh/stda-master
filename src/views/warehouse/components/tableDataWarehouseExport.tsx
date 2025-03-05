import { BasicColumn } from '@/components/Table';
import { formatNumber } from '@/utils/helper/tsxHelper';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã phiếu xuất',
      dataIndex: 'release_id',
      width: 120,
      align: 'center',
    },
    {
      title: 'Ngày xuất',
      dataIndex: 'date_of_release',
      width: 100,
      align: 'center',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 100,
      align: 'right',
      customRender: ({ record }) => {
        const quantity = record?.items?.reduce((a, b) => a + Number(b?.quantity), 0);
        if (quantity) return formatNumber(quantity);
        return '';
      },
    },
    {
      title: 'Người tạo',
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
  };
}

export function mockData(): any[] {
  return [
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
    {
      release_id: '2409001',
      release_note: '2409001',
      date_of_release: '17/09/2024',
      entered_by: 'Admin',
    },
  ];
}
