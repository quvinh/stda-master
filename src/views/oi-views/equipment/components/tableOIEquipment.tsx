import { formatNumber } from '@/utils/helper/tsxHelper';
import { Checkbox, Input } from 'ant-design-vue';
import { ColumnType } from 'ant-design-vue/es/table';
import dayjs from 'dayjs';

export const columnsTop: ColumnType[] = [
  { title: 'A (%)', dataIndex: 'a' },
  { title: 'TG chạy (ph)', dataIndex: 'total_run_time' },
  { title: 'TG dừng (ph)', dataIndex: 'total_stop_time' },
  { title: 'Số lần dừng', dataIndex: 'stop_times' },
];

export const columnsMiddle: ColumnType[] = [
  { title: 'Số lot', dataIndex: 'lot', key: 'lot' },
  { title: 'Mã sản phẩm', dataIndex: 'productCode', key: 'productCode' },
  { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
  { title: 'SL NG', dataIndex: 'ngQuantity', key: 'ngQuantity' },
];

export const columnsMiddleTK: ColumnType[] = [
  { title: 'Số PO', dataIndex: 'po' },
  { title: 'Mã Pallet/Lot', dataIndex: 'pallet_lot' },
  { title: 'Mã sản phẩm', dataIndex: 'product_id' },
  { title: 'Tên sản phẩm', dataIndex: 'product_name' },
  { title: 'Số lượng', dataIndex: 'quantity' },
  { title: 'SL thực tế', dataIndex: 'actual_quantity' },
  { title: 'Tỷ lệ HT(%)', dataIndex: 'percent' },
];

export const columnsBottom: ColumnType[] = [
  {
    title: 'Số LSX',
    dataIndex: 'batch_id',
    width: 120,
  },
  {
    title: 'Số lot',
    dataIndex: 'lot_id',
    width: 150,
  },
  {
    title: 'Mã thành phần',
    dataIndex: 'product_id',
    width: 150,
  },
  {
    title: 'Chiều dài (mm)',
    dataIndex: 'length',
    width: 120,
  },
  {
    title: 'Kế hoạch (pcs)',
    dataIndex: 'planQuantity',
    width: 120,
  },
  {
    title: 'Bắt đầu KH',
    dataIndex: 'start_date',
    width: 120,
  },
  {
    title: 'Kết thúc KH',
    dataIndex: 'end_date',
    width: 120,
  },
  {
    title: 'Thực tế (pcs)',
    dataIndex: 'actualQuantity',
    width: 120,
  },
  {
    title: 'Thực tế (ok)',
    dataIndex: 'actual_ok_quantity',
    width: 120,
  },
  {
    title: 'Bắt đầu TT',
    dataIndex: 'actual_start_date',
    width: 120,
  },
  {
    title: 'Kết thúc TT',
    dataIndex: 'actual_end_date',
    width: 120,
  },
  {
    title: 'Thời điểm hoàn thành',
    dataIndex: 'completed_at',
    width: 180,
  },
];

export const columnsEquipmentParameter: ColumnType[] = [
  {
    title: 'Thời điểm ghi nhận',
    dataIndex: 'created_at',
    width: 140,
    customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
  },
  {
    title: 'Số PO',
    dataIndex: 'po',
    width: 80,
  },
  {
    title: 'Mã Pallet',
    dataIndex: 'pallet_id',
    width: 80,
  },
  {
    title: 'Thông số',
    dataIndex: 'equipment_parameter',
    width: 180,
    customRender: ({ value }) => value?.parameter_name,
  },
  {
    title: 'ĐVT',
    dataIndex: 'equipment_parameter_unit',
    width: 80,
    customRender: ({ value }) => value?.unit?.parameter_name,
  },
  {
    title: 'Tiêu chuẩn',
    dataIndex: 'standard_parameter',
    width: 100,
    customRender: ({ value }) => (value?.standard ? formatNumber(value.standard) : '-'),
  },
  {
    title: 'Thực tế',
    dataIndex: 'value',
    width: 120,
    customRender: ({ value }) => formatNumber(value),
  },
  {
    title: 'Mức vượt',
    dataIndex: 'excess_level',
    width: 100,
  },
];

export const columnsEquipmentParameterTK: any[] = [
  {
    title: 'Thời gian bắt đầu đo',
    dataIndex: 'start_time',
    width: 80,
  },
  {
    title: 'Thời gian kết thúc đo',
    dataIndex: 'end_time',
    width: 80,
  },
  {
    title: 'Các chỉ tiêu đo lường thiết bị',
    children: [
      {
        title: 'Áp lực lô kép',
        dataIndex: 'ap_luc',
        width: 100,
      },
      {
        title: 'Tốc độ giấy',
        dataIndex: 'toc_do_giay',
        width: 100,
      },
      {
        title: 'Độ cứng nước',
        dataIndex: 'do_cung_nuoc',
        width: 100,
      },
      {
        title: 'Độ pH',
        dataIndex: 'ph',
        width: 100,
      },
      {
        title: 'Nhiệt độ',
        dataIndex: 'nhiet_do',
        width: 100,
      },
    ],
  },
];

export const columnsErrorEquipment: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'no',
    align: 'left',
    fixed: 'left',
    width: 50,
    customRender: ({ index }) => index + 1,
  },
  {
    title: 'Thời gian dừng',
    dataIndex: 'stop_time',
    width: 150,
    align: 'left',
    customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
  },
  {
    title: 'Thời gian chạy',
    dataIndex: 'start_time',
    width: 150,
    align: 'left',
    customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
  },
  {
    title: 'Mã lỗi',
    dataIndex: 'error_equipment_id',
    width: 100,
    align: 'left',
  },
  {
    title: 'Tên lỗi',
    dataIndex: 'error_equipment_name',
    width: 140,
    align: 'left',
  },
  {
    title: 'Nguyên nhân',
    dataIndex: 'reason',
    width: 160,
    align: 'left',
  },
  {
    title: 'Cách khắc phục',
    dataIndex: 'fix',
    width: 180,
    align: 'left',
  },
  // {
  //   title: 'Phòng ngừa',
  //   dataIndex: 'protection_measures',
  //   width: 180,
  //   align: 'left',
  // },
  {
    title: 'Tình trạng',
    dataIndex: 'status',
    width: 100,
    align: 'left',
  },
];

export const columnsErrorEquipmentSelected: ColumnType[] = [
  {
    title: 'Thời gian dừng',
    dataIndex: 'stop_time',
    width: 150,
    align: 'left',
  },
  {
    title: 'Thời gian chạy',
    dataIndex: 'start_time',
    width: 150,
    align: 'left',
  },
  {
    title: 'Mã lỗi',
    dataIndex: 'error_equipment_id',
    width: 100,
    align: 'left',
  },
  {
    title: 'Tên lỗi',
    dataIndex: 'error_equipment_name',
    width: 140,
    align: 'left',
  },
  {
    title: 'Nguyên nhân',
    dataIndex: 'reason',
    width: 160,
    align: 'left',
  },
  {
    title: 'Tác vụ',
    key: 'action',
    fixed: 'right',
    width: 100,
  },
];

export const columnsErrorEquipmentSelectedTK: ColumnType[] = [
  {
    title: 'Thời gian dừng',
    dataIndex: 'stop_time',
    width: 150,
    align: 'left',
  },
  {
    title: 'Thời gian chạy',
    dataIndex: 'start_time',
    width: 150,
    align: 'left',
  },
  {
    title: 'Mã lỗi',
    dataIndex: 'error_equipment_id',
    width: 100,
    align: 'left',
  },
  {
    title: 'Tên lỗi',
    dataIndex: 'error_equipment_name',
    width: 140,
    align: 'left',
  },
  {
    title: 'Nguyên nhân',
    dataIndex: 'reason',
    width: 160,
    align: 'left',
  },
  {
    title: 'Cách khắc phục',
    dataIndex: 'fix',
    width: 160,
    align: 'left',
  },
  {
    title: 'Tình trạng',
    dataIndex: 'status',
    width: 100,
    align: 'left',
  },
];

export const columnsEquipmentMaintenance: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'no',
    fixed: 'left',
    width: 50,
    customRender: ({ index }) => index + 1,
  },
  {
    title: 'Hạng mục bảo dưỡng',
    dataIndex: 'maintenance_type',
    width: 200,
  },
  {
    title: 'Nội dung bảo dưỡng',
    dataIndex: 'notes',
    width: 200,
  },
  {
    title: 'Vị trí',
    dataIndex: 'maintenance_unit',
    width: 100,
  },
  {
    title: 'Giải thích',
    dataIndex: 'explain',
    width: 200,
  },
  {
    title: 'Ghi chú',
    dataIndex: 'notes',
    width: 200,
  },
  {
    title: 'Bắt đầu',
    dataIndex: 'start_time',
    width: 200,
  },
  {
    title: 'Kết thúc',
    dataIndex: 'end_time',
    width: 200,
  },
  {
    title: 'Thao tác',
    key: 'action',
    width: 100,
  },
];

export const columnsCheckList: ColumnType[] = [
  {
    title: 'STT',
    dataIndex: 'no',
    width: 60,
    customRender: ({ index }) => index + 1,
  },
  {
    title: 'Hạng mục kiểm tra',
    dataIndex: 'hang_muc',
    width: 120,
  },
  {
    title: 'Công việc kiểm tra',
    dataIndex: 'cong_viec',
    width: 120,
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    width: 80,
  },
  {
    title: 'Ngày kiểm tra',
    dataIndex: 'date',
    width: 80,
  },
  {
    title: 'Xác nhận',
    dataIndex: 'confirm',
    width: 100,
    customRender: ({ record }) => {
      if (record?.confirm_type === 'checkbox') {
        return <Checkbox />;
      }
      return <Checkbox />;
      // return <Input size="small" placeholder="Nhập thông số" value={value} />;
    },
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    width: 200,
  },
];
