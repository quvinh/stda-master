<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Thông tin phiếu nhập"
    :showOkBtn="false"
  >
    <Space direction="vertical" size="small" class="w-100%">
      <Descriptions layout="vertical" size="small" bordered>
        <DescriptionsItem label="Mã phiếu nhập" style="text-align: center">{{
          record?.receipt_id
        }}</DescriptionsItem>
        <DescriptionsItem label="Đơn nhập" style="text-align: center">{{
          record?.receipt_id
        }}</DescriptionsItem>
        <DescriptionsItem label="Ngày nhập" style="text-align: center">{{
          record?.date_of_receipt
        }}</DescriptionsItem>
        <!-- <Descriptions layout="vertical" bordered> -->
        <DescriptionsItem label="Người tạo" style="text-align: center">
          {{ record?.entered_by }}
        </DescriptionsItem>

        <DescriptionsItem label="Ghi chú" style="text-align: center">
          {{ record?.receipt_id }}
        </DescriptionsItem>
        <!-- </Descriptions> -->
      </Descriptions>
      <Table
        size="small"
        :columns="columnn"
        :dataSource="items"
        bordered
        :pagination="false"
        :scroll="{ x: 300 }"
      />
    </Space>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Descriptions, DescriptionsItem, Table, Space } from 'ant-design-vue';
  import { ref } from 'vue';

  const record = ref<any>();
  const items = ref<any[]>([]);

  /**
   * @description: form schema
   */

  const columnn: any[] = [
    {
      title: 'Nguyên vật liệu',
      dataIndex: 'material',
      align: 'center',
      customRender: ({ value }) => value?.material_name,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity_1',
      align: 'center',
      customRender: ({ value }) => Number(value),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      align: 'center',
      customRender: ({ record }) => record?.unit1?.unit_name,
    },
  ];

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    record.value = data.record;
    console.log(record.value);
    if (data.record?.items) {
      items.value = data.record.items?.map((item) => item);
    }
    setModalProps({ loading: false, confirmLoading: false });
  });
</script>
