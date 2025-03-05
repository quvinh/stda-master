import { BasicColumn } from '@/components/Table';
import { formatNumber } from '@/utils/helper/tsxHelper';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã máy',
      dataIndex: 'equipment_id',
      align: 'center',
      fixed: 'center',
      width: 100,
    },
    {
      title: 'Mã công đoạn',
      dataIndex: 'process_id',
      align: 'center',
      fixed: 'center',
      width: 100,
    },
    // {
    //   title: 'Mã LSX',
    //   dataIndex: 'batch_code',
    //   align: 'center',
    //   width: 200,
    // },
    // {
    //   title: 'Mã Pallet',
    //   dataIndex: 'lot_id',
    //   align: 'center',
    //   width: 250,
    // },
    {
      title: 'Thời điểm ghi nhận',
      dataIndex: 'created_at',
      align: 'center',
      width: 150,
      customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : ''),
    },
    {
      title: 'Thông số',
      dataIndex: 'parameter_name',
      align: 'center',
      width: 200,
      customRender: ({ record }) => record?.equipment_parameter?.parameter_name,
    },
    {
      title: 'Tiêu chuẩn',
      dataIndex: 'standard_parameter',
      align: 'right',
      width: 80,
      customRender: ({ record }) => {
        const { standard_parameter } = record;
        return standard_parameter?.standard ? formatNumber(standard_parameter?.standard) : '-';
      },
    },
    {
      title: 'Thực tế',
      dataIndex: 'value',
      align: 'right',
      width: 80,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Chênh lệch',
      dataIndex: 'muc_vuot',
      align: 'right',
      width: 100,
      customRender: ({ record }) => {
        const { standard_parameter, value: recordValue } = record;
        // console.log('record', record);
        // console.log('recordValue', recordValue);
        const standard = Number(standard_parameter?.standard);
        // console.log('standard', standard);
        const real = Number(recordValue);
        if (!standard || !real) return '-';
        const muc_vuot = real - standard;
        return formatNumber(muc_vuot);
      },
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
