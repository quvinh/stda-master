import { BasicColumn } from '@/components/Table';
import { formatNumber } from '@/utils/helper/tsxHelper';
// import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

// import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Thời gian kiểm tra',
      align: 'left',
      width: 150,
      customRender: ({ record }) => {
        return record?.quality_checks?.[0]?.created_at
          ? dayjs(record?.quality_checks?.[0]?.created_at).format('DD/MM/YYYY HH:mm:ss')
          : '';
      },
    },
    {
      title: 'Máy',
      dataIndex: 'equipment_id',
      align: 'left',
      width: 100,
    },
    {
      title: 'Công đoạn',
      dataIndex: 'process_id',
      align: 'left',
      width: 100,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_id',
      align: 'left',
      width: 150,
    },
    {
      title: 'Số LSX',
      dataIndex: 'batch_code',
      align: 'left',
      width: 150,
    },
    {
      title: 'Mã Pallet',
      dataIndex: 'lot_id',
      align: 'left',
      width: 250,
    },
    {
      title: 'SL kế hoạch',
      align: 'left',
      width: 100,
      customRender: ({ record }) => {
        return formatNumber(record?.lot_plan?.quantity);
      },
    },
    {
      title: 'SL thực tế',
      align: 'left',
      width: 100,
      customRender: ({ record }) => {
        return formatNumber(record?.quantity);
      },
    },
    {
      title: 'Kết quả',
      align: 'left',
      width: 100,
      customRender: ({ record }) => {
        return record?.quality_checks?.[0]?.result;
      },
    },
    {
      title: 'Người kiểm tra',
      align: 'left',
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
