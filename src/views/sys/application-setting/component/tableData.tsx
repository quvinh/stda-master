import { BasicColumn, FormProps } from '@/components/Table';
import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Slug',
      dataIndex: 'slug',
      align: 'center',
      width: 90,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Setting type',
      dataIndex: 'setting_type',
      align: 'center',
      width: 90,
    },
    {
      title: 'Boolean value',
      dataIndex: 'boolean_value',
      align: 'center',
      width: 90,
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
