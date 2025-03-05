import { BasicColumn, FormProps } from '@/components/Table';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã khách hàng',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 150,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      align: 'center',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      width: 150,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      align: 'center',
      width: 150,
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
      // {
      //   field: `tree`,
      //   label: `Tree`,
      //   component: 'TreeSelect',
      //   componentProps: {
      //     treeCheckable: true,
      //     treeData: [
      //       {
      //         title: 'Node 1',
      //         value: '0-0',
      //         children: [
      //           {
      //             title: 'Child Node 1',
      //             value: '0-0-1',
      //           },
      //           {
      //             title: 'Child Node 2',
      //             value: '0-0-2',
      //           },
      //         ],
      //       },
      //       {
      //         title: 'Node 2',
      //         value: '0-1',
      //         children: [
      //           {
      //             title: 'Child Node 3',
      //             value: '0-1-1',
      //           },
      //           {
      //             title: 'Child Node 4',
      //             value: '0-1-2',
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // },
      {
        field: `id`,
        label: `Mã khách hàng`,
        component: 'Input',
      },
      {
        field: `name`,
        label: `Tên khách hàng`,
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
