import { formatNumber } from '@/utils/helper/tsxHelper';
import { ColumnType } from 'ant-design-vue/es/table';
import dayjs from 'dayjs';

//=================MaterialImport=================
export const columnsTop: ColumnType[] = [
  { title: 'Tổng nhập', dataIndex: 'import', width: 90 },
  { title: 'Tổng xuất', dataIndex: 'export', width: 90 },
  { title: 'SL đã IQC', dataIndex: 'iqc', width: 90 },
  // { title: 'Tồn', dataIndex: 'inventory', width: 90 },
];

export const columnsMiddle: ColumnType[] = [
  {
    title: 'Mã phiếu nhập',
    dataIndex: 'material_import_id',
    width: 120,
  },
  {
    title: 'Mã NVL',
    dataIndex: 'material_id',
    width: 120,
  },
  {
    title: 'SL 1',
    dataIndex: 'quantity_1',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT 1',
    dataIndex: 'unit_id_1',
    width: 90,
    // customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'SL 2',
    dataIndex: 'quantity_2',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT 2',
    dataIndex: 'unit_id_2',
    width: 90,
    // customRender: ({ value }) => formatNumber(value),
  },

  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    fixed: 'right',
    width: 90,
    customRender: ({ record }) => {
      if (record?.pallet?.warehouse_history?.type === 'export') {
        return record?.pallet?.warehouse_history?.warehouse_location_id;
      }
      return '';
    },
  },
];

export const columnsBottom: ColumnType[] = [
  {
    title: 'Mã pallet',
    dataIndex: 'warehousehistoryable_id',
    width: 120,
  },
  {
    title: 'Mã NVL',
    dataIndex: 'material_id',
    width: 100,
    customRender: ({ record }) => record?.pallet?.material_id,
  },
  {
    title: 'Tên NVL',
    dataIndex: 'material_name',
    width: 250,
    customRender: ({ record }) => record?.pallet?.material?.material_name,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 70,
  },
  {
    title: 'ĐVT',
    dataIndex: 'unit_name',
    width: 60,
    customRender: ({ record }) => record?.unit?.unit_name,
  },
  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    width: 100,
  },
  {
    title: 'Người nhập',
    dataIndex: 'created_by',
    width: 100,
    customRender: ({ record }) => record?.created_by?.name,
  },
];

export const columnsBottomMaterialImport: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'no',
    fixed: 'left',
    width: 50,
    customRender: ({ index }) => index + 1,
  },
  {
    title: 'Mã phiếu nhập',
    dataIndex: 'material_receipt_id',
    width: 120,
    customRender: ({ record }) => record?.material_import?.id,
  },
  {
    title: 'Nhà cung cấp',
    dataIndex: 'supplier',
    width: 200,
    customRender: ({ record }) => record?.material_import_item?.supplier?.name,
  },
  {
    title: 'Mã Pallet',
    dataIndex: 'id',
    width: 150,
  },
  {
    title: 'Mã NVL',
    dataIndex: 'material_id',
    width: 150,
  },
  {
    title: 'Tên NVL',
    dataIndex: 'material_name',
    width: 200,
    customRender: ({ record }) => record?.material?.name,
  },
  {
    title: 'SL 1',
    dataIndex: 'quantity_1',
    width: 100,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT 1',
    dataIndex: 'unit_id_1',
    width: 100,
    customRender: ({ record }) => record?.unit1?.name,
  },
  {
    title: 'SL 2',
    dataIndex: 'quantity_2',
    width: 100,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT 2',
    dataIndex: 'unit_id_2',
    width: 100,
    customRender: ({ record }) => record?.unit2?.name,
  },
  {
    title: 'Số PO',
    dataIndex: 'lot_no',
    width: 80,
  },
  // {
  //   title: 'Số lượng',
  //   dataIndex: 'quantity',
  //   width: 80,
  // },
  {
    title: 'Vị trí',
    dataIndex: 'location',
    width: 80,
    // customRender: ({ record }) => record?.unit?.unit_name,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    fixed: 'right',
    width: 100,
    customRender: ({ record }) => {
      const status = record?.quality_check?.status ?? null;
      switch (status) {
        case 'OK':
          return 'OK';
        case 'NG':
          return 'NG';
        default:
          return 'Chưa kiểm';
      }
    },
  },
];

//=================MaterialExport=================
export const columnsTopExport: ColumnType[] = [
  { title: 'SL cần xuất', dataIndex: 'needed' },
  { title: 'Tổng xuất', dataIndex: 'export' },
  { title: 'Tỷ lệ HT', dataIndex: 'percent' },
];

export const columnsMiddleExport: ColumnType[] = [
  {
    title: 'Mã phiếu xuất',
    dataIndex: 'material_export_id',
    width: 120,
    customRender: ({ record }) => record?.material_export?.id,
  },
  {
    title: 'Mã NVL',
    dataIndex: 'material_id',
    width: 120,
  },
  {
    title: 'SL',
    dataIndex: 'quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT',
    dataIndex: 'unit_id',
    width: 90,
    customRender: ({ record }) => record?.unit?.unit_name,
  },
  // {
  //   title: 'SL 1',
  //   dataIndex: 'quantity_1',
  //   width: 90,
  //   customRender: ({ record }) => formatNumber(record?.pallet?.quantity_1),
  // },
  // {
  //   title: 'ĐVT 1',
  //   dataIndex: 'unit_id_1',
  //   width: 90,
  //   customRender: ({ record }) => record?.pallet?.unit1?.unit_name,
  // },
  // {
  //   title: 'SL 2',
  //   dataIndex: 'quantity_2',
  //   width: 90,
  //   customRender: ({ record }) => formatNumber(record?.pallet?.quantity_2),
  // },
  // {
  //   title: 'ĐVT 2',
  //   dataIndex: 'unit_id_2',
  //   width: 90,
  //   customRender: ({ record }) => record?.pallet?.unit2?.unit_name,
  // },
  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    width: 90,
    customRender: ({ record, value }) =>
      record?.pallet?.warehouse_history_export?.warehouse_location_id || value,
  },
];

export const columnsMaterialExport: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'no',
    width: 60,
    customRender: ({ index }) => index + 1,
  },
  {
    title: 'Mã phiếu xuất',
    dataIndex: 'material_export_id',
    width: 120,
  },
  {
    title: 'Mã Pallet',
    dataIndex: 'pallet_id',
    width: 120,
  },
  {
    title: 'Mã NVL',
    dataIndex: 'material_id',
    width: 120,
  },
  {
    title: 'Tên NVL',
    dataIndex: 'material_name',
    width: 250,
    customRender: ({ record }) => record?.material?.material_name,
  },
  {
    title: 'SL cần xuất',
    dataIndex: 'quantity',
    width: 80,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    width: 90,
    customRender: ({ record }) => record?.pallet?.warehouse_history_export?.warehouse_location_id,
  },
  {
    title: 'Thời gian',
    dataIndex: 'created_at',
    width: 120,
    customRender: ({ record }) => {
      if (record?.pallet?.warehouse_history_export?.type === 'export') {
        return dayjs(record?.pallet?.warehouse_history_export?.created_at).format(
          'DD/MM/YYYY HH:mm',
        );
      }
      return '';
    },
  },
];

export const columnsExportHistory: ColumnType[] = [
  {
    title: 'Mã pallet',
    dataIndex: 'warehousehistoryable_id',
    width: 120,
  },
  {
    title: 'Mã NVL',
    dataIndex: 'material_id',
    width: 100,
    customRender: ({ record }) => record?.pallet?.material_id,
  },
  {
    title: 'Tên NVL',
    dataIndex: 'material_name',
    width: 250,
    customRender: ({ record }) => record?.pallet?.material?.material_name,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 70,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT',
    dataIndex: 'unit_name',
    width: 60,
    customRender: ({ record }) => record?.unit?.unit_name,
  },
  {
    title: 'Vị trí',
    dataIndex: 'warehouse_location_id',
    width: 100,
  },
  {
    title: 'Thời gian xuất',
    dataIndex: 'date',
    width: 100,
  },
  {
    title: 'Người xuất',
    dataIndex: 'created_by',
    width: 100,
    customRender: ({ record }) => record?.created_by?.name,
  },
];
