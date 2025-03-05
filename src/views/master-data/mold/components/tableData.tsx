// tableData.ts
import IAttribute from '@/api/model/IAttribute';
import { BasicColumn, FormProps, FormSchema } from '@/components/Table';

export function getFormConfig(attributes?: IAttribute[]): Partial<FormProps> {
  const schemas = [
    {
      field: 'id',
      label: 'Mã khuôn',
      component: 'Input',
    },
    {
      field: 'name',
      label: 'Tên khuôn',
      component: 'Input',
    },
  ];

  // Thêm các trường động từ attributes (loại bỏ id, name)
  if (attributes && attributes.length > 0) {
    attributes.forEach((attr) => {
      if (attr.name !== 'id' && attr.name !== 'name') {
        let component = 'Input';
        if (attr.attribute_type === 'boolean') {
          component = 'Switch';
        } else if (attr.attribute_type === 'integer' || attr.attribute_type === 'decimal') {
          component = 'InputNumber';
        }
        schemas.push({
          field: attr.name,
          label: attr.display_name,
          component,
        });
      }
    });
  }

  return {
    layout: 'vertical',
    schemas: schemas as unknown as FormSchema[],
  };
}

export function getBasicColumns(attributes: IAttribute[]): BasicColumn[] {
  const columns: BasicColumn[] = [
    { title: 'Mã khuôn', dataIndex: 'id', align: 'center', fixed: 'left', width: 120 },
    { title: 'Tên khuôn', dataIndex: 'name', align: 'center', width: 150 },
  ];

  if (attributes && attributes.length > 0) {
    attributes.forEach((attr) => {
      if (attr.name !== 'id' && attr.name !== 'name') {
        columns.push({
          title: attr.display_name,
          dataIndex: attr.name,
          align: 'center',
        });
      }
    });
  }

  return columns;
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
  };
}
