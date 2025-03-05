import { ColumnType } from 'ant-design-vue/es/table';

export const columnsTop: ColumnType[] = [
  {
    title: 'Tổng Pallet chờ kiểm',
    dataIndex: 'kh',
    width: 200,
  },
  {
    title: 'Tổng Pallet đã kiểm',
    dataIndex: 'tt',
    width: 200,
  },
  {
    title: 'Tổng Pallet NG',
    dataIndex: 'percent_kh',
    width: 200,
  },
  {
    title: '% NG',
    dataIndex: 'percent_mt',
    width: 200,
  },
];

export const columnsMiddle: ColumnType[] = [
  {
    title: 'Mã máy',
    dataIndex: 'equipment_id',
    width: 120,
  },
  {
    title: 'Mã pallet',
    dataIndex: 'lot_id',
    width: 120,
  },
  {
    title: 'Mã BTP',
    dataIndex: 'material_id',
    width: 120,
  },
  {
    title: 'Tên BTP',
    dataIndex: 'material_name',
    width: 120,
  },
  {
    title: 'Số lượng TT',
    dataIndex: 'actual_quantity',
    width: 120,
  },
  {
    title: 'Số lượng NG',
    dataIndex: 'ng_quantity',
    width: 120,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'display_status',
    width: 120,
  },
];

export const columnsBottom: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'stt',
    fixed: 'left',
    width: 50,
  },
  {
    title: 'Mã PO',
    dataIndex: 'batch_code',
    width: 120,
  },
  {
    title: 'Lot number',
    dataIndex: 'lot_number',
    width: 120,
  },
  {
    title: 'Mã Máy',
    dataIndex: 'equipment_id',
    width: 120,
  },
  {
    title: 'Mã Pallet',
    dataIndex: 'lot_id',
    width: 120,
  },
  {
    title: 'Mã BTP',
    dataIndex: 'material_id',
    width: 120,
  },
  {
    title: 'Tên BTP',
    dataIndex: 'material_name',
    width: 120,
  },
  {
    title: 'SL.TT',
    dataIndex: 'actual_quantity',
    width: 70,
  },
  {
    title: 'SL.OK',
    dataIndex: 'ok_quantity',
    width: 70,
  },
  {
    title: 'SL.NG',
    dataIndex: 'ng_quantity',
    width: 70,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'display_status',
    fixed: 'right',
    width: 90,
  },
];

export const columnsTopTK: ColumnType[] = [
  {
    title: 'Tổng SL.KH ngày',
    dataIndex: 'kh_ngay',
  },
  {
    title: 'Tổng SL.KH theo thời điểm',
    dataIndex: 'kh_thoi_diem',
  },
  {
    title: 'Tổng SL.SX theo thời điểm',
    dataIndex: 'sx_thoi_diem',
  },
  {
    title: 'Tỉ lệ HT (%) theo thời điểm',
    dataIndex: 'percent',
  },
];

export const columnsMiddleTK: ColumnType[] = [
  { title: 'Số PO', dataIndex: 'po', fixed: 'left' },
  { title: 'Mã Pallet/Lot', dataIndex: 'pallet_lot' },
  { title: 'Mã sản phẩm', dataIndex: 'product_id' },
  { title: 'Tên sản phẩm', dataIndex: 'product_name' },
  { title: 'Số lượng', dataIndex: 'quantity' },
  { title: 'SL thực tế', dataIndex: 'actual_quantity' },
  { title: 'SL thực tế chờ xử lý', dataIndex: 'actual_quantity_wait' },
  { title: 'SL NG', dataIndex: 'quantity_ng' },
  { title: 'Tỷ lệ HT(%)', dataIndex: 'percent' },
  { title: 'In tem', dataIndex: 'print', fixed: 'right', width: 100 },
];

export const columnsBottomTK: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'no',
    fixed: 'left',
    width: 60,
    customRender: ({ index }) => index + 1,
  },
  { title: 'Số PO', dataIndex: 'po', width: 100 },
  { title: 'Mã Pallet/Lot', dataIndex: 'pallet_lot', width: 100 },
  { title: 'Mã sản phẩm', dataIndex: 'product_id', width: 100 },
  { title: 'Tên sản phẩm', dataIndex: 'product_name', width: 100 },
  { title: 'Số lượng', dataIndex: 'quantity', width: 80 },
  { title: 'SL thực tế', dataIndex: 'actual_quantity', width: 100 },
  { title: 'SL thực tế chờ xử lý', dataIndex: 'actual_quantity_wait', width: 100 },
  { title: 'SL NG', dataIndex: 'quantity_ng', width: 100 },
  { title: 'Tỷ lệ HT(%)', dataIndex: 'percent', width: 100 },
];
