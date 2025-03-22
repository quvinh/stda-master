import { BasicColumn, FormProps } from '@/components/Table';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Tên Quiz',
      dataIndex: 'title',
      align: 'center',
      width: 100,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: 150,
    },
    {
      title: 'Người tạo',
      dataIndex: 'created_by',
      align: 'center',
      width: 120,
      customRender: ({ record }) => record?.user?.name,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      align: 'center',
      width: 120,
      customRender: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : ''),
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    layout: 'vertical',
    schemas: [
      {
        field: `name`,
        label: `Tên chức vụ`,
        component: 'Input',
      },
    ],
  };
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
  };
}

/**
 * Translate slug master data
 * @param value
 * @returns string
 */
export function translateSlugMasterData(value: string | undefined | null) {
  switch (value) {
    case 'bom':
      return 'BOM';
    case 'customer':
      return 'Khách hàng';
    case 'department':
      return 'Phòng ban';
    case 'equipment':
      return 'Thiết bị';
    case 'equipment_parameter':
      return 'Thông số thiết bị';
    case 'error_equipment':
      return 'Lỗi dừng máy';
    case 'finished_product_export':
      return 'Xuất thành phẩm';
    case 'finished_product_import':
      return 'Nhập thành phẩm';
    case 'material_export':
      return 'Xuất NVL';
    case 'material_receipt':
      return 'Nhập NVL';
    case 'material':
      return 'Nguyên vật liệu';
    case 'process':
      return 'Công đoạn';
    case 'production_plan':
      return 'Kế hoạch sản xuất';
    case 'product':
      return 'Thành phẩm';
    case 'standard_parameter':
      return 'Thông số tiêu chuẩn';
    case 'supplier':
      return 'Nhà cung cấp';
    case 'warehouse':
      return 'Kho';
    case 'warehouse_location':
      return 'Vị trí kho';
    case 'role':
      return 'vai trò';
    case 'permission':
      return 'Quyền hạn';
    case 'user':
      return 'Người dùng';
    case 'template':
      return 'Template';
    case 'engine_power':
      return 'Năng suất máy';
    case 'unit':
      return 'Đơn vị tính';
    case 'evaluation_criteria':
      return 'Chỉ tiêu kiểm tra';
    case 'mold':
      return 'Khuôn';
    case 'jig':
      return 'JIG';
    case 'acceptance_quality_limit':
      return 'Tiêu chuẩn bốc mẫu';
    case 'change_overtime':
      return 'Change overtime';
    case 'cnc_tool_holder':
      return 'Bầu dao';
    case 'cnc_lathe_tool':
      return 'Dao cụ';
    case 'cnc_lathe_tool_type':
      return 'Loại dao cụ';
    case 'spec':
      return 'Spec';
    default:
      return 'Not found';
  }
}

/**
 * Get slug master data: search, create, update, delete
 * @param data
 * @returns array
 */
export function getSlugMasterData(data: any[]): any[] {
  const result = [
    ...new Set(
      data
        .filter(
          ({ label }) =>
            String(label).endsWith('.search') ||
            String(label).endsWith('.create') ||
            String(label).endsWith('.update') ||
            String(label).endsWith('.delete'),
        )
        .map((item) => String(item.label).split('.')[0]),
    ),
  ];
  return result;
}

/**
 * Get slug master data: search, create, update, delete
 * @param data
 * @returns array
 */
export function getSlugView(data: any[], type: 'ui' | 'oi'): any[] {
  const result = [...new Set(data.filter(({ label }) => String(label).startsWith(`${type}.`)))];
  return result;
}
