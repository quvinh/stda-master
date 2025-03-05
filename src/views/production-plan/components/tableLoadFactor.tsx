import { BasicColumn } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Công đoạn',
      dataIndex: 'process',
      align: 'center',
      width: 180,
    },
    {
      title: 'Line',
      dataIndex: 'line',
      align: 'center',
      width: 180,
    },
    {
      title: 'Phân loại',
      dataIndex: 'type',
      align: 'center',
      width: 180,
    },
    {
      title: 'W44',
      align: 'center',
      children: [
        {
          title: '04/11',
          dataIndex: 'maintenanceDate',
          align: 'center',
          width: 100,
        },
        {
          title: '05/11',
          dataIndex: 'equipmentName',
          align: 'center',
          width: 100,
        },
        {
          title: '06/11',
          dataIndex: 'maintenanceUnit',
          align: 'right',
          width: 100,
        },
        {
          title: '07/11',
          dataIndex: 'maintenanceCategory',
          align: 'center',
          width: 100,
        },
        {
          title: '08/11',
          dataIndex: 'maintenanceContent',
          align: 'center',
          width: 100,
        },
        {
          title: '09/11',
          dataIndex: 'explain',
          align: 'center',
          width: 100,
        },
        {
          title: '10/11',
          dataIndex: 'explain',
          align: 'center',
          width: 100,
        },
      ],
    },
    {
      title: 'W45',
      dataIndex: 'w45',
      align: 'center',
      width: 100,
    },
    {
      title: 'W46',
      dataIndex: 'w46',
      align: 'center',
      width: 100,
    },
    {
      title: 'W47',
      dataIndex: 'w47',
      align: 'center',
      width: 100,
    },
    {
      title: 'W48',
      dataIndex: 'w48',
      align: 'center',
      width: 100,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      align: 'center',
      width: 100,
    },
  ];
}

export function mockData(): any[] {
  return [
    {
      stt: 1,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van A',
    },
    {
      stt: 2,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van B',
    },
    {
      stt: 3,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van C',
    },
    {
      stt: 4,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van D',
    },
    {
      stt: 5,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van A',
    },
    {
      stt: 6,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van A',
    },
    {
      stt: 7,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van A',
    },
    {
      stt: 8,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van A',
    },
    {
      stt: 9,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van A',
    },
    {
      stt: 10,
      ngay_bao_duong: '13/09/2024',
      ten_thiet_bi: 'Máy 02',
      don_vi_bao_duong: 'Unit A',
      hang_muc_bao_duong: 'Type A',
      noi_dung_bao_duong: 'Note 1',
      giai_thich: '-',
      thoi_gian_thuc_hien: 60,
      nguoi_thuc_hien: 'Nguyen Van A',
    },
  ];
}

export const columns = [
  {
    title: 'Mã công đoạn',
    dataIndex: 'maCongDoan',
    key: 'maCongDoan',
    width: 100,
    customRender: ({ record }) => (
      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
        <span>{record.maCongDoan}</span>
      </div>
    ),
  },
  {
    title: 'Phân loại',
    dataIndex: 'phanLoai',
    key: 'phanLoai',
    width: 100,
    customRender: ({ record }) => (
      <div>
        {record.phanLoai?.map((item) => {
          return (
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              <span>{item}</span>
              <br />
            </div>
          );
        })}
      </div>
    ),
  },
  {
    title: '08/12/2024',
    dataIndex: 'day8',
    width: 100,
    key: 'day8',
    customRender: ({ record }) => (
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day8.machine_capa}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day8.plan}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day8.load_factor}%</span>
          <br />
        </div>
      </div>
    ),
  },
  {
    title: '09/12/2024',
    dataIndex: 'day9',
    width: 100,
    key: 'day9',
    customRender: ({ record }) => (
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day9.machine_capa}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day9.plan}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day9.load_factor}%</span>
          <br />
        </div>
      </div>
    ),
  },
  {
    title: '10/12/2024',
    dataIndex: 'day10',
    width: 100,
    key: 'day10',
    customRender: ({ record }) => (
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day10.machine_capa}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day10.plan}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day10.load_factor}%</span>
          <br />
        </div>
      </div>
    ),
  },
  {
    title: '11/12/2024',
    dataIndex: 'day11',
    width: 100,
    key: 'day11',
    customRender: ({ record }) => (
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day11.machine_capa}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day11.plan}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day11.load_factor}%</span>
          <br />
        </div>
      </div>
    ),
  },
  {
    title: '12/12/2024',
    dataIndex: 'day12',
    width: 100,
    key: 'v',
    customRender: ({ record }) => (
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day12.machine_capa}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day12.plan}</span>
          <br />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          <span>{record.day12.load_factor}%</span>
          <br />
        </div>
      </div>
    ),
  },
];
