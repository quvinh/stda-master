import { BasicColumn } from '@/components/Table';
import { Tag } from 'ant-design-vue';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_id',
      align: 'left',
      fixed: 'left',
      width: 150,
    },
    {
      title: 'Số LSX',
      dataIndex: 'batch_id',
      align: 'left',
      width: 150,
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'invoice_number',
      align: 'left',
      width: 150,
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      align: 'left',
      width: 100,
      fixed: 'right',
      customRender: ({ index }) => {
        if (index === 10 || index === 15) return <Tag color="#ed6f6f">NG</Tag>;
        return <Tag color="#55d187">OK</Tag>;
      },
    },
  ];
}

export function getActionColumn(): BasicColumn {
  return {
    width: 120,
    title: 'Thao tác',
    dataIndex: 'action',
  };
}

export function mockData(): any[] {
  return [
    {
      product_id: 'SP.BITHUKRAFLOVEPOP',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.172K0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801L0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801M0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801N0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801P0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801V0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801W0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Y0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.185.1030',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802E0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802F0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'SP.BITHUKRAFLOVEPOP',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.172K0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801L0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801M0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801N0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801P0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801V0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801W0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Y0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.185.1030',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802E0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802F0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'SP.BITHUKRAFLOVEPOP',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.172K0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801L0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801M0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801N0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801P0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801V0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801W0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Y0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.185.1030',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802E0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802F0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'SP.BITHUKRAFLOVEPOP',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.172K0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801L0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801M0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801N0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801P0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801V0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801W0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Y0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.185.1030',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802E0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802F0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'SP.BITHUKRAFLOVEPOP',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.172K0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801L0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801M0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801N0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801P0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801V0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801W0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Y0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.185.1030',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802E0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802F0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'SP.BITHUKRAFLOVEPOP',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.172K0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801L0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801M0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801N0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801P0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801V0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801W0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Y0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.185.1030',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802E0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802F0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'SP.BITHUKRAFLOVEPOP',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.172K0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801L0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801M0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801N0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801P0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801V0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801W0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Y0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.185.1030',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802E0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802F0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'SP.BITHUKRAFLOVEPOP',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.172K0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801L0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801M0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801N0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801P0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801V0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801W0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Y0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.185.1030',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802E0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802F0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'SP.BITHUKRAFLOVEPOP',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.172K0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801L0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801M0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801N0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801P0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801V0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801W0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Y0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.801Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802X0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.802Z0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805C0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.1807.805D0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DW.185.1030',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802E0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
    {
      product_id: 'HOP.DWA.185.802F0',
      batch_id: 'DDH1508/112_136',
      invoice_number: 'DDH1508/112_136',
    },
  ];
}
