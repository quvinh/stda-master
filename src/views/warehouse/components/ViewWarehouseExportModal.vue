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
      title: type.value === 1 ? 'Nguyên vật liệu' : 'Thành Phẩm',
      dataIndex: type.value === 1 ? 'nvl' : 'tp',
      align: 'center',
    },
    { title: 'Số lượng', dataIndex: 'so_luong', align: 'center' },
    { title: 'Đơn vị tính', dataIndex: 'don_vi_tinh', align: 'center' },
  ]);

  const dataTab = ref<any[]>([]);

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal] = useModalInner(async (data) => {
    record.value = data.record;
    type.value = data.type;
    console.log(type.value);
    if (type.value === 1) {
      dataTab.value = record.value.items?.map((i, index) => ({
        stt: index + 1,
        nvl: i.material?.material_name,
        so_luong: Number(i.quantity),
        don_vi_tinh: i.material.unit.unit_name,
      }));
    } else {
      dataTab.value = [];
      dataTab.value.push({
        stt: 1,
        tp: data.record.product?.product_name,
        so_luong: Number(data.record?.quantity),
        don_vi_tinh: data.record.unit?.unit_name,
      });
    }
  });

  const getTitle = 'Thông tin phiếu xuất';
</script>
