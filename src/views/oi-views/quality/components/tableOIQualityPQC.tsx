import { formatNumber } from '@/utils/helper/tsxHelper';
import { ColumnType } from 'ant-design-vue/es/table';

export const columnsTop: ColumnType[] = [
  {
    title: 'Tổng Pallet chờ kiểm',
    dataIndex: 'waiting_pallets',
    width: 150,
  },
  {
    title: 'Tổng Pallet đã kiểm',
    dataIndex: 'checked_pallets',
    width: 150,
  },
  {
    title: 'Tổng Pallet NG',
    dataIndex: 'ng_pallets',
    width: 120,
  },
  {
    title: '% NG',
    dataIndex: 'ng_percentage',
    width: 70,
  },
];

export const columnsMiddle: ColumnType[] = [
  {
    title: 'Mã máy',
    dataIndex: 'equipment_id',
    fixed: 'left',
    width: 100,
  },
  {
    title: 'Mã pallet',
    dataIndex: 'lot_id',
    width: 200,
  },
  {
    title: 'Mã BTP',
    dataIndex: 'material_id',
    width: 120,
  },
  // {
  //   title: 'Tên BTP',
  //   dataIndex: 'material_name',
  //   width: 120,
  // },
  {
    title: 'SL.TT',
    dataIndex: 'actual_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'SL.NG',
    dataIndex: 'ng_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'display_status',
    fixed: 'right',
    width: 90,
  },
];

export const columnsBottom: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'stt',
    fixed: 'left',
    width: 50,
    customRender: ({ index }) => index + 1,
  },
  {
    title: 'Mã PO',
    dataIndex: 'batch_code',
    width: 120,
  },
  {
    title: 'Lot number',
    dataIndex: 'customer_name',
    width: 120,
  },
  {
    title: 'Mã Máy',
    dataIndex: 'equipment_id',
    width: 100,
  },
  {
    title: 'Mã Pallet',
    dataIndex: 'lot_id',
    width: 200,
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
    title: 'SL.TT',
    dataIndex: 'actual_quantity',
    width: 70,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'SL.OK',
    dataIndex: 'ok_quantity',
    width: 70,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'SL.NG',
    dataIndex: 'ng_quantity',
    width: 70,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'display_status',
    fixed: 'right',
    width: 90,
  },
];
