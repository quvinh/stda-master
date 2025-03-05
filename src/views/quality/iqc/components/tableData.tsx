import { BasicColumn } from '@/components/Table';
// import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã Pallet',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: 150,
    },
    {
      title: 'Lot numner',
      dataIndex: 'lot_no',
      align: 'left',
      width: 150,
    },
    {
      title: 'Mã NVL',
      dataIndex: 'material_id',
      align: 'left',
      width: 150,
    },
    {
      title: 'Nhà cung cấp',
      align: 'left',
      width: 150,
      customRender: ({ record }) => {
        return record.material_receipt_item?.supplier?.supplier_name;
      },
    },
    {
      title: 'Số lượng 1',
      dataIndex: 'quantity_1',
      align: 'left',
      width: 250,
    },
    {
      title: 'Số lượng NG 1',
      dataIndex: 'quantity_ng_1',
      align: 'left',
      width: 250,
    },
    {
      title: 'ĐVT 1',
      align: 'left',
      width: 100,
      customRender: ({ record }) => {
        return record.unit1?.unit_name;
      },
    },
    {
      title: 'Số lượng 2',
      dataIndex: 'quantity_2',
      align: 'left',
      width: 250,
    },
    {
      title: 'ĐVT 2',
      align: 'left',
      width: 100,
      customRender: ({ record }) => {
        return record.unit2?.unit_name;
      },
    },
    {
      title: 'Ngày tạo',
      align: 'left',
      width: 100,
      customRender: ({ record }) => {
        return dayjs(record.created_at).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Kết quả',
      align: 'left',
      width: 100,
      customRender: ({ record }) => {
        return record?.quality_checks?.[0]?.result;
      },
    },
    {
      title: 'Người kiểm tra',
      align: 'left',
      width: 150,
      customRender: ({ record }) => {
        return record?.quality_checks?.[0]?.inspector?.name;
      },
    },
    // {
    //   title: 'IQC',
    //   dataIndex: 'result',
    //   align: 'left',
    //   width: 100,
    //   fixed: 'right',
    //   customRender: ({ record }) => {
    //     const result = record.quality_check?.result;
    //     let color = '#55d187';
    //     if (result === 'NG') {
    //       color = '#ed6f6f';
    //     }

    //     return <Tag style={{ backgroundColor: color, color: 'white' }}>{result}</Tag>;
    //   },
    // },
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
      material_id: 'TUTU-001-TBG',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp A',
      quantity: 100,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC4',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp B',
      quantity: 200,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC3',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp C',
      quantity: 150,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC2',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp D',
      quantity: 120,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC1',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp E',
      quantity: 180,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCP',
      material_name: 'Phôi thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp F',
      quantity: 250,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TBG',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp A',
      quantity: 100,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC4',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp B',
      quantity: 200,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC3',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp C',
      quantity: 150,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC2',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp D',
      quantity: 120,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC1',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp E',
      quantity: 180,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCP',
      material_name: 'Phôi thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp F',
      quantity: 250,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TBG',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp A',
      quantity: 100,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC4',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp B',
      quantity: 200,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC3',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp C',
      quantity: 150,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC2',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp D',
      quantity: 120,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC1',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp E',
      quantity: 180,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCP',
      material_name: 'Phôi thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp F',
      quantity: 250,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC4',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp B',
      quantity: 200,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC3',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp C',
      quantity: 150,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC2',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp D',
      quantity: 120,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC1',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp E',
      quantity: 180,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCP',
      material_name: 'Phôi thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp F',
      quantity: 250,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC4',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp B',
      quantity: 200,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC3',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp C',
      quantity: 150,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC2',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp D',
      quantity: 120,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCNC1',
      material_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp E',
      quantity: 180,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
    {
      material_id: 'TUTU-001-TCP',
      material_name: 'Phôi thép TUTU-001 (40x60x55)',
      supplier_name: 'Nhà cung cấp F',
      quantity: 250,
      unit_name: 'kg',
      created_at: '2024-09-26',
      result: 'OK',
    },
  ];
}
