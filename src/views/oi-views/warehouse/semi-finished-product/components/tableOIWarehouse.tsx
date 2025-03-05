import { Tag } from 'ant-design-vue';
import { ColumnType } from 'ant-design-vue/es/table';

//=================MaterialImport=================
export const columnsTop: ColumnType[] = [
  { title: 'Tổng nhập', dataIndex: 'import' },
  { title: 'Tổng xuất', dataIndex: 'export' },
  { title: 'Tồn', dataIndex: 'inventory' },
];

export const columnsMiddle: ColumnType[] = [
  { title: 'LSX', dataIndex: 'batch' },
  { title: 'Số lượng', dataIndex: 'quantity' },
  { title: 'Vị trí', dataIndex: 'location' },
];

export const finishedProductColumnsBottom: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 100,
  },
  {
    title: 'Mã thành phẩm',
    dataIndex: 'finished_product_id',
    width: 200,
  },
  {
    title: 'Tên thành phẩm',
    dataIndex: 'finished_product_name',
    width: 200,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 100,
  },
];

export const columnsBottom: ColumnType[] = [
  {
    title: 'Mã Lot',
    dataIndex: 'lot_id',
    width: 120,
  },
  {
    title: 'Mã thành phẩm',
    dataIndex: 'product_id',
    width: 150,
  },
  {
    title: 'Tên thành phẩm',
    dataIndex: 'product_name',
    width: 250,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 70,
  },
  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    width: 100,
  },
  {
    title: 'Thời gian xuất',
    dataIndex: 'create_time',
    width: 100,
  },
  {
    title: 'Người xuất',
    dataIndex: 'created_by',
    width: 100,
  },
];

export const columnsBottom1: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 100,
  },
  {
    title: 'Mã phiếu nhập',
    dataIndex: 'finished_product_import_id',
    width: 100,
  },
  {
    title: 'Mã sản phẩm',
    dataIndex: 'product_id',
    width: 200,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 80,
  },
  {
    title: 'ĐVT',
    dataIndex: 'unit',
    width: 80,
  },
  {
    title: 'Vị trí',
    dataIndex: 'position',
    width: 80,
  },
  {
    title: 'Mã KH',
    dataIndex: 'customer_id',
    width: 80,
  },
  {
    title: 'PI',
    dataIndex: 'pi',
    width: 80,
  },
  // {
  //   title: 'Trạng thái IQC',
  //   dataIndex: 'status',
  //   width: 100,
  //   customRender: ({ record }) => {
  //     const status = record?.material_receipt_item?.quality_check?.result ?? null;
  //     switch (status) {
  //       case 'OK':
  //         return <Tag color="#55d187">OK</Tag>;
  //       case 'NG':
  //         return <Tag color="#ed6f6f">NG</Tag>;
  //       default:
  //         return <Tag color="#ffae00">Chưa kiểm</Tag>;
  //     }
  //   },
  // },
];

//=================MaterialExport=================
