import { BasicColumn, FormProps } from '@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Slug',
      dataIndex: 'slug',
      align: 'center',
      width: 150,
    },
    {
      title: 'Template',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Chiều cao',
      dataIndex: 'height',
      align: 'center',
      width: 100,
    },
    {
      title: 'Chiều rộng',
      dataIndex: 'width',
      align: 'center',
      width: 100,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
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
        field: `name`,
        label: `Template`,
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
