<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :showOkBtn="false">
    <Descriptions size="small" layout="vertical" bordered>
      <DescriptionsItem label="Mã phiếu xuất" style="text-align: center">{{
        record?.release_id
      }}</DescriptionsItem>
      <DescriptionsItem label="Ngày xuất" style="text-align: center">{{
        record?.date_of_release
      }}</DescriptionsItem>
      <!-- <Descriptions layout="vertical" bordered> -->
      <DescriptionsItem label="Người tạo" style="text-align: center">
        {{ record?.entered_by }}
      </DescriptionsItem>
    </Descriptions>

    <br />
    <Table size="small" :columns="columnn" :dataSource="dataTab" bordered />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Descriptions, DescriptionsItem, Table } from 'ant-design-vue';
  import { computed, ref } from 'vue';

  const record = ref<any>();
  const type = ref(1);
  /**
   * @description: form schema
   */

  const columnn = computed(() => [
    { title: 'STT', dataIndex: 'stt', align: 'center' },
    {
      title: 'Thành Phẩm',
      dataIndex: 'product_name',
      align: 'center',
    },
    { title: 'Số lượng', dataIndex: 'so_luong', align: 'right' },
    { title: 'Đơn vị tính', dataIndex: 'don_vi_tinh', align: 'center' },
  ]);

  const dataTab = ref<any[]>([]);

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal] = useModalInner(async (data) => {
    record.value = data.record;
    type.value = data.type;
    dataTab.value = record.value.items?.map((i, index) => ({
      stt: index + 1,
      product_name: i.product?.product_name,
      so_luong: Number(i.quantity),
      don_vi_tinh: i.product.unit?.unit_name,
    }));
  });

  const getTitle = 'Thông tin phiếu xuất';
</script>
