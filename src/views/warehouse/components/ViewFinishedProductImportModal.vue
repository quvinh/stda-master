<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Thông tin lệnh nhập kho"
    :showOkBtn="false"
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
        :title="() => h('div', { class: 'font-bold' }, 'Thành phẩm')"
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
      title: 'Mã thành phẩm',
      dataIndex: 'product_id',
      align: 'center',
      width: 180,
    },
    {
      title: 'Tên thành phẩm',
      dataIndex: 'product_name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'right',
      width: 90,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      align: 'center',
      width: 90,
      // customRender: ({ record }) => record?.product?.unit?.unit_name,
    },
  ]);

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    record.value = data.record;
    if (data.record?.items) {
      items.value = data.record.items?.map((item) => ({
        ...item,
        product_name: item?.product?.product_name,
        unit: item?.product?.unit?.unit_name,
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
