import { BasicColumn, FormProps } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Tên tài khoản',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      align: 'center',
      width: 150,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      align: 'center',
      width: 260,
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      align: 'center',
      width: 250,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      width: 150,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    // labelWidth: 120,
    layout: 'vertical',
    schemas: [
      {
        field: `user_name`,
        label: `Tên đăng nhập`,
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
