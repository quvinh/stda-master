import { BasicColumn, FormProps } from '@/components/Table';
import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Tên cột',
      dataIndex: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: 'Tên cột (số nhiều)',
      dataIndex: 'plural_name',
      align: 'center',
      width: 100,
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'display_name',
      align: 'center',
      width: 100,
    },
    {
      title: 'Loại giá trị',
      dataIndex: 'attribute_type',
      align: 'center',
      width: 100,
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'display_order',
      align: 'center',
      width: 100,
    },
    {
      title: 'Trường bắt buộc',
      dataIndex: 'is_required',
      align: 'center',
      width: 100,
      customRender: ({ value }) => (
        <Tag color={value ? 'blue' : 'default'}>{value ? 'YES' : 'NO'}</Tag>
      ),
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
    // labelWidth: 120,
    layout: 'vertical',
    schemas: [
      {
        field: `id`,
        label: `Mã đơn vị tính`,
        component: 'Input',
      },
      {
        field: `unit_name`,
        label: `Đơn vị tính`,
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
