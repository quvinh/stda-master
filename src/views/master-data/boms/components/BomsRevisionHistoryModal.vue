<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :showOkBtn="false">
    <Descriptions bordered layout="vertical" size="small" :column="6">
      <DescriptionsItem label="Mã BOM">{{ record?.id }}</DescriptionsItem>
      <DescriptionsItem label="Mã nội bộ">{{ record?.id }}</DescriptionsItem>
      <DescriptionsItem label="Mã PI">{{ record?.pi }}</DescriptionsItem>
      <DescriptionsItem label="Mã khách hàng">{{ record?.customer_id }}</DescriptionsItem>
      <DescriptionsItem label="Số lượng">{{ record?.quantity }}</DescriptionsItem>
      <DescriptionsItem label="Đơn vị">{{ record?.unit?.unit_name }}</DescriptionsItem>
    </Descriptions>
    <br />
    <Table size="small" :columns="columnn" :dataSource="bomLog" bordered />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Descriptions, DescriptionsItem, Table } from 'ant-design-vue';
  import { useBomsStore } from '@/store/modules/states/boms';
  import dayjs from 'dayjs';

  const bomsStore = useBomsStore();
  const record = ref<any>({});
  const bomLog = ref<any[]>([]);

  /**
   * @description: form schema
   */

  const columnn = [
    { title: 'Ngày cập nhật', dataIndex: 'updated_at', align: 'left' },
    { title: 'Người cập nhật', dataIndex: 'user_id', align: 'left' },
    { title: 'Nội dung', dataIndex: 'method', align: 'left' },
  ];

  async function getLog(id: any) {
    const bomLogs = await bomsStore.searchLog({ id: id, table_name: 'Bom' });
    if (bomLogs) {
      bomLog.value = [];
      const updated_at = dayjs(bomLogs?.updated_at).format('YYYY-MM-DD HH:mm:ss');
      bomLog.value.push({
        updated_at: updated_at,
        user_id: bomLogs?.user_id,
        method: bomLogs?.method,
      });
    } else return;
  }

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    record.value = data.record;
    getLog(record.value.id);

    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = 'Lịch sử chỉnh sửa BOM';
</script>
