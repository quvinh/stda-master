import { BasicColumn } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Ngày sản xuất',
      dataIndex: 'operating_date',
      align: 'left',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Máy',
      dataIndex: 'equipment',
      align: 'left',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'LSX',
      dataIndex: 'lsx',
      align: 'left',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'LOT',
      dataIndex: 'lot',
      align: 'left',
      fixed: 'left',
      width: 140,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_id',
      align: 'left',
      width: 160,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product_name',
      align: 'left',
      width: 200,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'start_date',
      align: 'left',
      width: 150,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'end_date',
      align: 'left',
      width: 150,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'left',
      width: 150,
    },
    {
      title: 'Circly time',
      dataIndex: 'circly_time',
      align: 'left',
      width: 150,
    },
    {
      title: 'Số bao',
      dataIndex: 'so_bao',
      align: 'left',
      width: 150,
    },
    {
      title: 'Takt time',
      dataIndex: 'task_time',
      align: 'left',
      width: 150,
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
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'OPFE-16176-TP',
      product_name: 'Tấm kẹp dưới thép OPFE-16176 (40x50x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
    {
      operating_date: '11/09/2024 01:47',
      equipment: 'may_02',
      lsx: '2409007',
      lot: '2409007L038',
      product_id: 'TUTU-001-TP',
      product_name: 'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      start_date: '11/09/2024 01:47',
      end_date: '11/09/2024 01:48',
      quantity: '25',
      circly_time: '60',
      so_bao: '60',
      task_time: '1',
    },
  ];
}
