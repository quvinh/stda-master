import { formatNumber } from '@/utils/helper/tsxHelper';
import { ColumnType } from 'ant-design-vue/es/table';

export const columnsTop: ColumnType[] = [
  {
    title: 'Pallet chờ kiểm',
    dataIndex: 'not_checked',
  },
  {
    title: 'Pallet đã kiểm',
    dataIndex: 'checked',
  },
  {
    title: 'Tổng SL.NG',
    dataIndex: 'sum_ng',
  },
  {
    title: 'Tổng SL.OK',
    dataIndex: 'sum_ok',
  },
  {
    title: 'Tỉ lệ NG',
    dataIndex: 'percent_ng',
  },
];

export const columnsMiddle: ColumnType[] = [
  // {
  //   title: 'Mã phiếu',
  //   dataIndex: 'material_receipt_id',
  //   width: 120,
  // },
  {
    title: 'Mã Pallet',
    dataIndex: 'id',
    width: 120,
  },
  {
    title: 'Mã NVL',
    dataIndex: 'material_id',
    width: 120,
  },
  {
    title: 'SL',
    dataIndex: 'quantity_1',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT',
    dataIndex: 'unit1',
    width: 60,
  },
  {
    title: 'Kết quả',
    dataIndex: 'result',
    width: 90,
    customRender: ({ record }) => {
      const result = record.quality_check?.result;
      if (result === 'OK') return 'OK';
      if (result === 'NG') return 'NG';
      else return 'Chưa kiểm';
    },
  },
];

export const columnsBottom: ColumnType[] = [
  // {
  //   title: 'Số phiếu',
  //   dataIndex: 'material_receipt_id',
  //   width: 120,
  // },
  {
    title: 'Mã Pallet',
    dataIndex: 'id',
    width: 120,
    // fixed: 'left',
  },
  {
    title: 'Lot number',
    dataIndex: 'lot_no',
    width: 100,
  },
  {
    title: 'Mã NVL',
    dataIndex: 'material_id',
    width: 120,
  },
  {
    title: 'Nhà cung cấp',
    dataIndex: 'supplier',
    width: 150,
  },
  {
    title: 'SL 1',
    dataIndex: 'init_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'SL NG 1',
    dataIndex: 'quantity_ng_1',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT 1',
    dataIndex: 'unit1',
    width: 80,
  },
  {
    title: 'SL 2',
    dataIndex: 'quantity_2',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT 2',
    dataIndex: 'unit2',
    width: 80,
  },
  {
    title: 'Kết quả',
    dataIndex: 'result',
    fixed: 'right',
    width: 90,
    customRender: ({ record }) => {
      const result = record.quality_check?.status;
      if (result === 'OK') return 'OK';
      if (result === 'NG') return 'NG';
      else return 'Chưa kiểm';
    },
  },
];

export const columnsModal: ColumnType[] = [
  {
    title: 'Mã Pallet',
    dataIndex: 'id',
    width: 120,
  },
  {
    title: 'Mã NVL',
    dataIndex: 'material_id',
    width: 120,
  },
  {
    title: 'SL',
    dataIndex: 'quantity_1',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'ĐVT',
    dataIndex: 'unit1',
    width: 80,
  },
];
