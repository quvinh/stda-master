import { BasicColumn, FormProps } from '@/components/Table';
import { formatNumber } from '@/utils/helper/tsxHelper';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã thông số',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Tên thông số',
      dataIndex: 'equipment_parameter_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Thiết bị',
      dataIndex: 'equipment_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Tiêu chuẩn',
      dataIndex: 'standard',
      align: 'right',
      width: 120,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Tiêu chuẩn tối đa',
      dataIndex: 'standard_max',
      align: 'right',
      width: 120,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Tiêu chuẩn tối thiểu',
      dataIndex: 'standard_min',
      align: 'right',
      width: 120,
      customRender: ({ value }) => formatNumber(value),
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
        label: `Mã thông số`,
        component: 'Input',
      },
      {
        field: `equipment_parameter_id`,
        label: `Tên thông số`,
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
