import { BasicColumn, FormProps } from '@/components/Table';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Slug',
      dataIndex: 'slug',
      align: 'center',
      width: 100,
    },
    // {
    //   title: 'Phòng ban',
    //   dataIndex: 'department',
    //   align: 'center',
    //   width: 150,
    // },
    {
      title: 'Tên quyền hạn',
      dataIndex: 'name',
      align: 'center',
      width: 120,
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
        field: `positon`,
        label: `Tên quyền hạn`,
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
