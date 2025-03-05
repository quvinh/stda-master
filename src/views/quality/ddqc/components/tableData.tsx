import { BasicColumn } from '@/components/Table';
import { formatNumber } from '@/utils/helper/tsxHelper';
import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_id',
      align: 'center',
      width: 150,
    },
    {
      title: 'Số LSX',
      dataIndex: 'batch_code',
      align: 'center',
      width: 150,
    },
    {
      title: 'Mã Pallet',
      dataIndex: 'lot_id',
      align: 'center',
      width: 250,
    },
    {
      title: 'Công đoạn',
      dataIndex: 'process_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'Máy',
      dataIndex: 'equipment_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'SL chạy thử',
      dataIndex: 'fai_quantity',
      align: 'right',
      width: 100,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Thời gian kiểm tra',
      align: 'center',
      width: 150,
      customRender: ({ record }) => {
        return record?.quality_checks?.[0]?.start_time
          ? dayjs(record?.quality_checks?.[0]?.start_time).format('DD/MM/YYYY HH:mm:ss')
          : '';
      },
    },
    {
      title: 'Người kiểm tra',
      align: 'center',
      width: 150,
      customRender: ({ record }) => {
        return record?.quality_checks?.[0]?.inspector?.name;
      },
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
