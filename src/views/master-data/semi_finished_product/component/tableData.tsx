import { BasicColumn, FormProps } from '@/components/Table';

export const getBasicColumns = (): BasicColumn[] => {
  return [
    {
      title: 'Mã BTP',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Tên BTP',
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: 'Loại BTP',
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
      {
        field: `id`,
        label: `Mã BTP`,
        component: 'Input',
      },
      {
        field: `material_name`,
        label: `Tên BTP`,
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
