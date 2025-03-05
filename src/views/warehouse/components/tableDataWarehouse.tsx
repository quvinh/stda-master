import { BasicColumn } from '@/components/Table';
import { formatNumber } from '@/utils/helper/tsxHelper';
import dayjs from 'dayjs';

export function getBasicColumns(method: 'all' | 'import' | 'export'): BasicColumn[] {
  let im: boolean = true;
  let ex: boolean = true;
  switch (method) {
    case 'import':
      im = true;
      ex = false;
      break;
    case 'export':
      im = false;
      ex = true;
      break;
    default:
      im = true;
      ex = true;
      break;
  }

  return [
    {
      title: 'Mã kho',
      dataIndex: 'warehouse_id',
      align: 'center',
      fixed: 'left',
      width: 150,
    },
    {
      title: 'Mã NVL',
      dataIndex: 'material_id',
      align: 'center',
      width: 150,
    },
    {
      title: 'Ngày',
      dataIndex: 'import_time',
      align: 'center',
      width: 120,
      customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY') : ''),
    },
    // {
    //   title: 'Mã khách hàng',
    //   dataIndex: 'ma_khach_hang',
    //   align: 'center',
    //   width: 150,
    // },
    // {
    //   title: 'Tên khách hàng',
    //   dataIndex: 'ten_khach_hang',
    //   align: 'center',
    //   width: 150,
    // },
    // {
    //   title: 'Mã hàng',
    //   dataIndex: 'product_id',
    //   align: 'center',
    //   width: 150,
    // },
    // {
    //   title: 'Tên SP',
    //   dataIndex: 'ten_san_pham',
    //   align: 'center',
    //   width: 150,
    // },
    {
      title: 'ĐVT',
      dataIndex: 'unit_name',
      align: 'center',
      width: 90,
    },
    {
      title: 'Vị trí',
      dataIndex: 'warehouse_location_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Nhập kho',
      defaultHidden: !im,
      children: [
        {
          title: 'Ngày nhập',
          dataIndex: 'import_time',
          align: 'center',
          width: 120,
          customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY') : ''),
        },
        {
          title: 'Số lượng',
          dataIndex: 'import_quantity',
          align: 'right',
          width: 100,
          customRender: ({ value }) => formatNumber(Number(value)),
        },
        {
          title: 'Người nhập',
          dataIndex: 'importer',
          align: 'center',
          width: 100,
        },
      ],
    },
    {
      title: 'Xuất kho',
      defaultHidden: !ex,
      children: [
        {
          title: 'Ngày xuất',
          dataIndex: 'export_time',
          align: 'center',
          width: 100,
          customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY') : ''),
        },
        {
          title: 'Số lượng',
          dataIndex: 'export_quantity',
          align: 'right',
          width: 100,
          customRender: ({ value }) => formatNumber(Number(value)),
        },
        {
          title: 'Người xuất',
          dataIndex: 'exporter',
          align: 'center',
          width: 100,
        },
      ],
    },
    {
      title: 'Tồn kho',
      width: '10%',
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'remaining_quantity',
          align: 'right',
          width: 100,
          customRender: ({ value }) => formatNumber(Number(value)),
        },
        {
          title: 'Số ngày tồn kho',
          dataIndex: 'days_in_stock',
          align: 'center',
          width: 150,
        },
      ],
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'center',
      width: 100,
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

export function mockData(): any[] {
  return [
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024', // Ngày nhập từ ảnh
      material_id: 'XI.KEM.800.030',
      unit_name: 'cuộn', // Giả định đơn vị
      warehouse_location_id: 'A-01', // Giả định vị trí kho
      import_quantity: 100, // Số lượng nhập từ ảnh
      importer: 'Nguyễn Văn Đạo', // Giả định người nhập
      export_time: '12/09/2024', // Chưa có xuất, để null
      export_quantity: 100, // Chưa có xuất
      exporter: 'Nguyễn Văn Đạo', // Chưa có xuất
      remaining_quantity: 100, // Tồn kho = nhập - xuất (ở đây chưa xuất)
      days_in_stock: 0, // Giả định số ngày tồn
      note: '', // Ghi chú từ ảnh
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.KEM.600.030',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-01',
      import_quantity: 1160,
      importer: 'Nguyễn Văn Đạo',
      export_time: '12/09/2024',
      export_quantity: 1160,
      exporter: 'Nguyễn Văn Đạo',
      remaining_quantity: 0,
      days_in_stock: 0,
      note: '',
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.B300.1',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-02',
      import_quantity: 1631,
      importer: 'Nguyễn Văn Đạo',
      export_time: '12/09/2024',
      export_quantity: 1631,
      exporter: 'Nguyễn Văn Đạo',
      remaining_quantity: 0,
      days_in_stock: 0,
      note: '',
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.B300APP.2',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-02',
      import_quantity: 3768,
      importer: 'Nguyễn Văn Đạo',
      export_time: '12/09/2024',
      export_quantity: 3768,
      exporter: 'Nguyễn Văn Đạo',
      remaining_quantity: 0,
      days_in_stock: 0,
      note: '',
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.CBL56.8-HG.OJI',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-02',
      import_quantity: 2791,
      importer: 'Nguyễn Văn Đạo',
      export_time: '',
      export_quantity: '',
      exporter: '',
      remaining_quantity: 2791,
      days_in_stock: 2,
      note: '',
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.CBL56.8-HG.OJI',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-03',
      import_quantity: 3829,
      importer: 'Nguyễn Văn Đạo',
      export_time: '',
      export_quantity: '',
      exporter: '',
      remaining_quantity: 3829,
      days_in_stock: 2,
      note: '',
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.CBL56.8-HG.OJI',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-03',
      import_quantity: 4289,
      importer: 'Nguyễn Văn Đạo',
      export_time: '',
      export_quantity: '',
      exporter: '',
      remaining_quantity: 4289,
      days_in_stock: 0,
      note: '',
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.CBL56.8-HG.OJI',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-03',
      import_quantity: 4603,
      importer: '',
      export_time: '',
      export_quantity: 0,
      exporter: '',
      remaining_quantity: 4603,
      days_in_stock: 2,
      note: '',
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.CBL56.8-HG.OJI',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-03',
      import_quantity: 571,
      importer: 'Nguyễn Văn Đạo',
      export_time: '12/09/2024',
      export_quantity: 571,
      exporter: 'Nguyễn Văn Đạo',
      remaining_quantity: 0,
      days_in_stock: 0,
      note: '',
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.CBL56.8-HG.OJI',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-03',
      import_quantity: 571,
      importer: 'Nguyễn Văn Đạo',
      export_time: '12/09/2024',
      export_quantity: 571,
      exporter: 'Nguyễn Văn Đạo',
      remaining_quantity: 0,
      days_in_stock: 0,
      note: '',
    },
    {
      warehouse_id: '10.XI.XUONGIN',
      import_time: '12/09/2024',
      material_id: 'XI.CBL56.8-HG.OJI',
      unit_name: 'cuộn',
      warehouse_location_id: 'A-03',
      import_quantity: 5671,
      importer: 'Nguyễn Văn Đạo',
      export_time: '',
      export_quantity: 0,
      exporter: '',
      remaining_quantity: 5671,
      days_in_stock: 2,
      note: '',
    },
  ];
}
