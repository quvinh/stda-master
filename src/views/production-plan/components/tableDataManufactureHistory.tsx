import { BasicColumn } from '@/components/Table';
import { formatNumber } from '@/utils/helper/tsxHelper';
import dayjs from 'dayjs';

export function getColumnsTop(): BasicColumn[] {
  return [
    {
      title: 'Số lượng đầu ra KH',
      dataIndex: 'planned_quantity',
      align: 'right',
      width: 150,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Số lượng đầu ra thực tế',
      dataIndex: 'actual_quantity',
      align: 'right',
      width: 150,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Chênh lệch (TT - KH)',
      align: 'right',
      width: 150,
      customRender: ({ record }) => {
        const plannedQuantity = record.planned_quantity || 0;
        const actualQuantity = record.actual_quantity || 0;
        const text = actualQuantity - plannedQuantity;
        return formatNumber(text);
      },
    },
    {
      title: 'Số lượng NG',
      dataIndex: 'ng_quantity',
      align: 'right',
      width: 150,
    },
    {
      title: 'Tỷ lệ NG',
      dataIndex: 'ng_rate',
      align: 'center',
      width: 150,
      customRender: ({ record }) => {
        return record.ng_rate ? `${record.ng_rate}%` : '-';
      },
    },
  ];
}

export function getColumnsBottom(): BasicColumn[] {
  return [
    {
      title: 'Mã lô sản xuất',
      dataIndex: 'batch_code',
      align: 'center',
      align: 'center',
      width: 200,
    },
    {
      title: 'Mã pallet',
      dataIndex: 'lot_id',
      align: 'center',
      align: 'center',
      width: 250,
    },
    {
      title: 'Mã công đoạn',
      dataIndex: 'process_id',
      align: 'center',
      width: 100,
      align: 'center',
      width: 100,
    },
    {
      title: 'Mã thiết bị',
      dataIndex: 'equipment_id',
      align: 'center',
      align: 'center',
      width: 80,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_id',
      align: 'center',
      align: 'center',
      width: 120,
    },
    {
      title: 'Bắt đầu kế hoạch',
      dataIndex: 'start_time',
      align: 'center',
      align: 'center',
      width: 120,
      customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
    },
    {
      title: 'Kết thúc kế hoạch',
      dataIndex: 'end_time',
      align: 'center',
      align: 'center',
      width: 120,
      customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
    },
    {
      title: 'Số lượng kế hoạch',
      dataIndex: 'planned_quantity',
      align: 'right',
      width: 120,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Số lượng thực tế',
      dataIndex: 'actual_quantity',
      align: 'right',
      width: 120,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Số lượng NG',
      dataIndex: 'ng_quantity',
      align: 'right',
      width: 120,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      align: 'center',
      width: 110,
    },
  ];
}
