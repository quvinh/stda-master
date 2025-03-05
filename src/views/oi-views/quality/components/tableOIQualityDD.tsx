import { formatNumber } from '@/utils/helper/tsxHelper';
import { ColumnType } from 'ant-design-vue/es/table';

export const oiQualityFaiMiddleColumns: ColumnType[] = [
  {
    title: 'Mã PO',
    dataIndex: 'batch_code',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'Mã Máy',
    dataIndex: 'equipment_id',
    width: 100,
  },
  {
    title: 'Tên BTP',
    dataIndex: 'material_name',
    width: 200,
  },
  {
    title: 'Số lượng KH',
    dataIndex: 'planned_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'display_status',
    width: 90,
    fixed: 'right',
    customRender: ({ value }) => String(value).toUpperCase(),
  },
];

export const oiQualityFaiBottomColumns: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 50,
    fixed: 'left',
  },
  {
    title: 'Mã PO',
    dataIndex: 'batch_code',
    width: 130,
    fixed: 'left',
  },
  {
    title: 'Mã Máy',
    dataIndex: 'equipment_id',
    width: 100,
  },
  {
    title: 'Mã BTP',
    dataIndex: 'material_id',
    width: 120,
  },
  {
    title: 'Tên BTP',
    dataIndex: 'material_name',
    width: 200,
  },
  {
    title: 'Thời gian BĐ',
    dataIndex: 'planned_start_time',
    width: 150,
  },
  {
    title: 'Thời gian KT',
    dataIndex: 'planned_end_time',
    width: 150,
  },
  {
    title: 'Số lượng KH',
    dataIndex: 'planned_quantity',
    width: 150,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT',
    dataIndex: 'unit_name',
    width: 70,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'display_status',
    width: 110,
    fixed: 'right',
    customRender: ({ value }) => String(value).toUpperCase(),
  },
];
