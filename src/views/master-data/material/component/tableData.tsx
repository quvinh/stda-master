import { BasicColumn, FormProps } from '@/components/Table';

export const getBasicColumns = (): BasicColumn[] => {
  return [
    {
      title: 'Mã NVL',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 120,
    },
    {
      title: 'Tên NVL',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Loại NVL',
      dataIndex: 'material_category',
      align: 'center',
      width: 120,
      customRender: ({ record }) => record?.material_category?.name,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      align: 'center',
      width: 100,
      customRender: ({ record }) => record?.unit?.name,
    },
    {
      title: 'Class',
      dataIndex: 'class',
      align: 'center',
      width: 120,
    },
  ];
};

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
        label: `Mã NVL`,
        component: 'Input',
      },
      {
        field: `material_name`,
        label: `Tên NVL`,
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
    fixed: 'right',
  };
}
