import { BasicColumn, FormProps } from '@/components/Table';
import dayjs from 'dayjs';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã vị trí kho',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Mã kho',
      dataIndex: 'warehouse_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Loại vị trí',
      dataIndex: 'location_type',
      align: 'center',
      width: 120,
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      align: 'right',
      width: 90,
    },
    // {
    //   title: 'X',
    //   dataIndex: 'x',
    //   align: 'center',
    //   width: 100,
    // },
    // {
    //   title: 'Y',
    //   dataIndex: 'y',
    //   align: 'center',
    //   width: 100,
    // },
    // {
    //   title: 'width',
    //   dataIndex: 'width',
    //   align: 'center',
    //   width: 50,
    // },
    // {
    //   title: 'height',
    //   dataIndex: 'height',
    //   align: 'center',
    //   width: 50,
    // },
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
        label: `Mã vị trí kho`,
        component: 'Input',
      },
      {
        field: `warehouse_id`,
        label: `Mã kho`,
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
