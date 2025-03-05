<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Thông tin lệnh nhập kho"
    :showOkBtn="false"
    style="top: 10px"
  >
    <Space direction="vertical" size="small" class="w-100%">
      <Descriptions layout="vertical" size="small" bordered :column="4">
        <DescriptionsItem label="Mã phiếu nhập" style="text-align: center">{{
          record?.receipt_id
        }}</DescriptionsItem>
        <DescriptionsItem label="Số PO" style="text-align: center">{{
          record?.lot_no
        }}</DescriptionsItem>
        <DescriptionsItem label="Ngày nhập" style="text-align: center">{{
          record?.date_of_receipt
        }}</DescriptionsItem>
        <DescriptionsItem label="Người tạo" style="text-align: center">
          {{ record?.entered_by }}
        </DescriptionsItem>
      </Descriptions>
      <Table
        size="small"
        :columns="columnn"
        :dataSource="items"
        bordered
        :pagination="false"
        :scroll="{ x: 800, y: 250 }"
        :title="
          () => h('div', { class: 'font-bold' }, type === 1 ? 'Nguyên vật liệu' : 'Thành phẩm')
        "
      />
      <Table
        v-if="type === 1"
        size="small"
        :columns="columnnPallets"
        :dataSource="pallets"
        bordered
        :pagination="false"
        :scroll="{ x: 800, y: 250 }"
        :title="() => h('div', { class: 'font-bold' }, 'Danh sách Pallets')"
      />
    </Space>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { formatNumber } from '@/utils/helper/tsxHelper';
  import { Descriptions, DescriptionsItem, Table, Space } from 'ant-design-vue';
  import { computed, h, ref } from 'vue';

  const record = ref<any>();
  const items = ref<any[]>([]);
  const type = ref<number>(1);
  const pallets = ref<any[]>([]);

  const columnn: any = computed(() => [
    {
      title: type.value === 1 ? 'Mã NVL' : 'Mã thành phẩm',
      dataIndex: type.value === 1 ? 'material_id' : 'product_id',
      align: 'left',
      width: 180,
    },
    {
      title: type.value === 1 ? 'Tên NVL' : 'Tên thành phẩm',
      dataIndex: type.value === 1 ? 'material' : 'product',
      align: 'left',
      width: 150,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity_1',
      align: 'right',
      width: 90,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit_1',
      align: 'left',
      width: 90,
      // customRender: ({ record }) => record?.product?.unit?.unit_name,
    },
  ]);

  const columnnPallets: any[] = [
    {
      title: 'Mã NVL',
      dataIndex: 'material_id',
      align: 'left',
      width: 180,
    },
    {
      title: 'Mã Pallet',
      dataIndex: 'id',
      align: 'left',
      width: 180,
    },
    {
      title: 'SL 1',
      dataIndex: 'quantity_1',
      align: 'right',
      width: 80,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'ĐVT 1',
      dataIndex: 'unit1',
      align: 'left',
      width: 80,
      customRender: ({ record }) => record?.unit1?.unit_name,
    },
    {
      title: 'SL 2',
      dataIndex: 'quantity_2',
      align: 'right',
      width: 80,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'ĐVT 2',
      dataIndex: 'unit2',
      align: 'left',
      width: 80,
      customRender: ({ record }) => record?.unit2?.unit_name,
    },
  ];

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    record.value = data.record;
    type.value = data.type;
    console.log(type.value);
    if (data.record?.items) {
      record.value.lot_no = data.record?.items[0].pallets[0]?.lot_no;
      items.value = data.record.items?.map((item) => ({
        ...item,
        material: item?.material?.material_name,
        unit_1: item?.material?.unit?.unit_name,
      }));
      const dataPallets =
        data.record.items?.reduce((acc, row) => {
          if (row?.pallets) {
            row.pallets.forEach((pallet) => {
              if (pallet?.id && !pallet?.parent_id) {
                acc.push(pallet);
              }
            });
          }
          return acc;
        }, []) || [];
      if (dataPallets) pallets.value = dataPallets;
    } else {
      console.log(data.record);
      items.value = [];
      if (data.record?.product) {
        items.value.push({
          product_id: data.record?.product_id,
          product: data.record?.product?.product_name,
          quantity_1: data.record?.quantity,
          unit_1: data.record?.product?.unit?.unit_name,
        });
      }
    }
    setModalProps({ loading: false, confirmLoading: false });
  });
</script>
