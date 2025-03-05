import { formatNumber } from '@/utils/helper/tsxHelper';
import { ColumnType } from 'ant-design-vue/es/table';
import dayjs from 'dayjs';

//=================MaterialImport=================
export const columnsTop: ColumnType[] = [
  { title: 'Tổng nhập', dataIndex: 'import', width: 90, customRender: ({ value }) => formatNumber(value) },
  { title: 'Tổng xuất', dataIndex: 'export', width: 90, customRender: ({ value }) => formatNumber(value) },
  { title: 'Tồn', dataIndex: 'inventory', width: 90, customRender: ({ value }) => formatNumber(value) },
];

export const columnsMiddle: ColumnType[] = [
  {
    title: 'Mã Lot',
    dataIndex: 'lot_id',
    width: 120,
  },
  {
    title: 'Mã thành phẩm',
    dataIndex: 'product_id',
    width: 120,
    customRender: ({ record }) => record?.lot?.product_id,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 80,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    width: 80,
    customRender: ({ record }) => {
      return (
        record?.lot?.warehouse_history_import?.warehouse_location_id ||
        record?.warehouse_history_import?.warehouse_location_id
      );
    },
  },
];

export const columnsMiddleExport: ColumnType[] = [
  {
    title: 'Mã Lot',
    dataIndex: 'lot_id',
    width: 120,
  },
  {
    title: 'Mã thành phẩm',
    dataIndex: 'product_id',
    width: 120,
    customRender: ({ record }) => record?.lot?.product_id,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 80,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    width: 80,
    customRender: ({ record }) => {
      return (
        record?.lot?.warehouse_history_export?.warehouse_location_id ||
        record?.warehouse_history_export?.warehouse_location_id
      );
    },
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

export const finishedProductColumnsBottom: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'stt',
    fixed: 'left',
    width: 50,
    customRender: ({ index }) => index + 1,
  },
  {
    title: 'LSX',
    dataIndex: 'production_plan_id',
    width: 90,
  },
  {
    title: 'Mã Lot',
    dataIndex: 'lot_id',
    width: 180,
    customRender: ({ record }) => record?.lot?.id,
  },
  {
    title: 'Mã thành phẩm',
    dataIndex: 'product_id',
    width: 120,
    customRender: ({ record }) => record?.product_id,
  },
  {
    title: 'Tên thành phẩm',
    dataIndex: 'product_name',
    width: 150,
    customRender: ({ record }) => record?.product?.product_name,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 80,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT',
    dataIndex: 'unit_id',
    width: 80,
    customRender: ({ record }) => record?.unit?.unit_name,
  },
  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    width: 80,
    customRender: ({ record }) => record?.lot?.warehousehistoryimport?.warehouse_location_id,
  },
  {
    title: 'Thời gian',
    dataIndex: 'exported_at',
    width: 100,
    customRender: ({ record }) => {
      const ex = record?.lot?.warehousehistoryexport?.created_at ?? null;
      if (ex) {
        return dayjs(ex).format('DD/MM/YYYY HH:mm');
      }
      return '';
    },
  },
];

export const columnsBottom1: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 50,
    customRender: ({ index }) => index + 1,
  },
  {
    title: 'LSX',
    dataIndex: 'batch_code',
    width: 120,
  },
  {
    title: 'Mã Lot',
    dataIndex: 'lot_id',
    width: 210,
  },
  {
    title: 'Mã thành phẩm',
    dataIndex: 'product_id',
    width: 120,
  },
  {
    title: 'Tên thành phẩm',
    dataIndex: 'product_name',
    width: 150,
    customRender: ({ record }) => record?.product?.product_name,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 80,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT',
    dataIndex: 'unit',
    width: 80,
    customRender: ({ record }) => record?.product?.unit?.unit_name,
  },
  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    width: 80,
    customRender: ({ record }) => {
      return (
        record?.lot?.warehouse_history_import?.warehouse_location_id ||
        record?.warehouse_history_import?.warehouse_location_id
      );
    },
  },
  {
    title: 'Thời gian nhập',
    dataIndex: 'created_at',
    width: 120,
    customRender: ({ record }) => {
      const created_at =
        record?.lot?.warehouse_history_import?.created_at ||
        record?.warehouse_history_import?.created_at;
      return created_at ? dayjs(created_at).format('DD/MM/YYYY HH:mm') : '';
    },
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
