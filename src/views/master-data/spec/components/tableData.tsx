import IAttribute from '@/api/model/IAttribute';
import { BasicColumn } from '@/components/Table';

export const getBasicColumns = (attributes?: IAttribute[]): BasicColumn[] => {
  const columns: BasicColumn[] = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_id',
      width: 150,
      align: 'center',
    },
    {
      title: 'Tên sản phẩm',
      width: 200,
      align: 'center',
      customRender: ({ record }) => {
        return <div>{record?.product?.name}</div>;
      },
    },
    {
      title: 'Mã công đọan',
      dataIndex: 'process_id',
      width: 100,
      align: 'center',
    },
    {
      title: 'Mã máy',
      dataIndex: 'equipment_id',
      width: 100,
      align: 'center',
    },
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
};

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
  };
}
