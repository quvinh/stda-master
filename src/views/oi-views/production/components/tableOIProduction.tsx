import { ColumnType } from 'ant-design-vue/es/table';
import { NODATA } from '@/utils/render';
import { formatNumber } from '@/utils/helper/tsxHelper';
import dayjs from 'dayjs';

export interface OiProductionTopColumns {
  planned_quantity: number | null;
  actual_quantity: number | null;
  planned_percentage: number | null;
  target_percentage: number | null;
}

export const oiProductionTopColumns: ColumnType<OiProductionTopColumns>[] = [
  {
    title: 'Kế hoạch (pcs)',
    dataIndex: 'planned_quantity',
    width: 100,
    customRender: ({ value }) => {
      return formatNumber(value);
    },
  },
  // {
  //   title: 'Kế hoạch (con)',
  //   dataIndex: 'planned_quantity',
  //   customRender: ({ value }) => {
  //     return value ? formatNumber(value) : '';
  //   },
  // },
  {
    title: 'Thực tế (pcs)',
    dataIndex: 'actual_quantity',
    width: 100,
    customRender: ({ value }) => {
      return formatNumber(value);
    },
  },
  // {
  //   title: 'Thực tế (con)',
  //   dataIndex: 'actual_quantity',
  //   customRender: ({ value }) => {
  //     return value ? formatNumber(value) : '';
  //   },
  // },
  {
    title: '% Kế hoạch',
    dataIndex: 'planned_percentage',
    width: 100,
    customRender: ({ value }) => {
      return value ? formatNumber(value) + '%' : '-';
    },
  },
  {
    title: '% Mục tiêu',
    dataIndex: 'target_percentage',
    width: 100,
    customRender: ({ value }) => {
      return value ? formatNumber(value) + '%' : '-';
    },
  },
];

export const columnsMiddle: ColumnType[] = [
  { title: 'Mã LSX', dataIndex: 'batch_id' },
  { title: 'Số lượng KH', dataIndex: 'quantity_plan' },
];

export interface OiProductionBottomColumns {
  stt: number | null;
  batch_code: string | null;
  lot_id: string | null;
  product_id: string | null;
  product_name: string | null;
  po_quantity: number | null;
  planned_quantity: number | null;
  actual_quantity: number | null;
  ng_quantity: number | null;
  planned_start_time: string | null;
  planned_end_time: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  status: string | null;
}

export const oiProductionBottomColumns: ColumnType<OiProductionBottomColumns>[] = [
  {
    title: 'STT',
    dataIndex: 'stt',
    fixed: 'left',
    width: 50,
    customRender: ({ index }) => index + 1,
  },
  {
    title: 'Số PO',
    dataIndex: 'batch_code',
    width: 150,
  },
  {
    title: 'Mã Pallet',
    dataIndex: 'lot_id',
    width: 200,
  },
  {
    title: 'Mã sản phẩm',
    dataIndex: 'product_id',
    width: 120,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'product_name',
    width: 150,
  },
  {
    title: 'SL đơn',
    dataIndex: 'po_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'SL KH',
    dataIndex: 'planned_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'SL TT',
    dataIndex: 'actual_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Số lượng NG',
    dataIndex: 'ng_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Bắt đầu KH',
    dataIndex: 'planned_start_time',
    width: 120,
    customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
  },
  {
    title: 'Kết thúc KH',
    dataIndex: 'planned_end_time',
    width: 120,
    customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
  },
  {
    title: 'Bắt đầu T.Tế',
    dataIndex: 'actual_start_time',
    width: 120,
    customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
  },
  {
    title: 'Kết thúc T.Tế',
    dataIndex: 'actual_end_time',
    width: 120,
    customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    fixed: 'right',
    width: 120,
  },
];

export interface OiProductionMiddle {
  batch_code: string | null;
  lot_id: string | null;
  product_id: string | null;
  customer_name: string | null;
  planned_quantity: number | null;
  actual_quantity: number | null;
  ng_quantity: number | null;
}

export const oiProductionMiddlecolumns: ColumnType<OiProductionMiddle>[] = [
  {
    title: 'Số PO',
    dataIndex: 'batch_code',
    width: 150,
    // batch_code nó ko là số nên ko được format nó
  },
  {
    title: 'Mã Pallet',
    dataIndex: 'lot_id',
    width: 200,
    customRender: ({ value }) => value || NODATA,
  },
  // {
  //   title: 'Lot number',
  //   dataIndex: 'customer_name',
  //   width: 100,
  // },
  // Chưa có lot_number chưa hiển thị
  {
    title: 'Mã sản phẩm',
    dataIndex: 'product_id',
    width: 150,
    customRender: ({ value }) => value || NODATA,
  },
  {
    title: 'Khách hàng',
    dataIndex: 'customer_name',
    width: 150,
    customRender: ({ value }) => value || NODATA,
  },
  {
    title: 'Kế hoạch(pcs)',
    dataIndex: 'planned_quantity',
    width: 100,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'T.Tế(pcs)',
    dataIndex: 'actual_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Ng(pcs)',
    dataIndex: 'ng_quantity',
    width: 90,
    customRender: ({ value }) => formatNumber(value),
  },
];
