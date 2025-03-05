import { BasicColumn } from '@/components/Table';
// import { Tag } from 'ant-design-vue';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Công đoạn',
      dataIndex: 'process_id',
      align: 'center',
      fixed: 'left',
      width: 120,
    },
    {
      title: 'Máy',
      dataIndex: 'equipment_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Số hạng mục',
      dataIndex: 'item_quantity',
      align: 'right',
      width: 100,
    },
    {
      title: 'Kế hoạch',
      dataIndex: 'planed_date',
      align: 'center',
      width: 120,
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'executed_date',
      align: 'center',
      width: 120,
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'executer_name',
      align: 'center',
      width: 120,
    },
  ];
}

export function getDetailColumns(): BasicColumn[] {
  return [
    {
      title: 'Công đoạn',
      dataIndex: 'process_id',
      align: 'center',
      fixed: 'left',
      width: 120,
    },
    {
      title: 'Máy',
      dataIndex: 'equipment_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Tên công việc',
      dataIndex: 'item_name',
      align: 'center',
      width: 220,
    },
    {
      title: 'Kế hoạch',
      dataIndex: 'planed_date',
      align: 'center',
      width: 120,
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'executed_date',
      align: 'center',
      width: 120,
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      align: 'center',
      width: 120,
    },
    {
      title: 'Bằng chứng',
      dataIndex: 'proof',
      align: 'center',
      width: 220,
    },
    {
      title: 'Nhận xét',
      dataIndex: 'note',
      align: 'center',
      width: 220,
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
      process_id: 'BINHBAI',
      equipment_id: 'BOI-7',
      maintenance_category_id: 'Hạng mục 5',
      planed_date: '2024-12-02',
      executed_date: '2024-12-04',
      executer_name: 'Nguyễn Văn A',
      details: [
        {
          task_name: 'Kiểm tra bộ phận',
          planed_date: '2024-12-02',
          executed_date: '2024-12-04',
          result: 'Hoàn thành',
          proof: 'Ảnh đính kèm',
          note: 'Hoạt động bình thường',
        },
        {
          task_name: 'Thay dầu',
          planed_date: '2024-12-02',
          executed_date: '2024-12-03',
          result: 'Cần kiểm tra thêm',
          proof: 'Báo cáo kiểm tra',
          note: 'Phát hiện lỗi nhỏ',
        },
      ],
    },
    {
      process_id: 'IN',
      equipment_id: 'BOI-3',
      maintenance_category_id: 'Hạng mục 2',
      planed_date: '2024-10-28',
      executed_date: '2024-10-30',
      executer_name: 'Trần Thị B',
      details: [
        {
          task_name: 'Vệ sinh thiết bị',
          planed_date: '2024-10-28',
          executed_date: '2024-10-30',
          result: 'Lỗi kỹ thuật',
          proof: 'Chứng nhận sửa chữa',
          note: 'Yêu cầu sửa chữa gấp',
        },
        {
          task_name: 'Kiểm tra nhiệt độ',
          planed_date: '2024-10-28',
          executed_date: '2024-10-30',
          result: 'Hoàn thành',
          proof: 'Ảnh đính kèm',
          note: 'Hoạt động bình thường',
        },
        {
          task_name: 'Thay thế linh kiện',
          planed_date: '2024-10-28',
          executed_date: '2024-10-31',
          result: 'Hoàn thành',
          proof: 'Video minh họa',
          note: 'Phát hiện lỗi nhỏ',
        },
      ],
    },
    {
      process_id: 'TP1',
      equipment_id: 'BOI-1',
      maintenance_category_id: 'Hạng mục 3',
      planed_date: '2024-11-15',
      executed_date: '2024-11-20',
      executer_name: 'Lê Văn C',
      details: [
        {
          task_name: 'Kiểm tra động cơ',
          planed_date: '2024-11-15',
          executed_date: '2024-11-20',
          result: 'Hoàn thành',
          proof: 'Báo cáo kiểm tra',
          note: 'Cần theo dõi thêm',
        },
        {
          task_name: 'Hiệu chỉnh máy',
          planed_date: '2024-11-15',
          executed_date: '2024-11-20',
          result: 'Cần kiểm tra thêm',
          proof: 'Video minh họa',
          note: 'Phát hiện lỗi nhỏ',
        },
      ],
    },
  ];
}
