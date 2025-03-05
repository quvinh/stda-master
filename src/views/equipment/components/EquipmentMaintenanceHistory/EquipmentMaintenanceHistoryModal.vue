<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :showOkBtn="false"
  >
    <Descriptions layout="vertical" bordered>
      <DescriptionsItem label="Ngày bảo dưỡng" style="text-align: center">{{
        record?.maintenanceDate
      }}</DescriptionsItem>
      <DescriptionsItem label="Tên thiết bị" style="text-align: center">{{
        record?.equipmentName
      }}</DescriptionsItem>
      <DescriptionsItem label="Người thực hiện" style="text-align: center">{{
        record?.maintenanceUser
      }}</DescriptionsItem>
    </Descriptions>
    <br />
    <Table size="middle" :columns="columnn" :dataSource="sparepartsData" bordered />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useForm } from '@/components/Form/index';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useCustomerStore } from '@/store/modules/states/customer';
  import { Descriptions, DescriptionsItem, Table } from 'ant-design-vue';
  import { IEquipmentMaintenanceHistories } from '@/api/model/IEquipmentMaintenanceHistories';

  const emit = defineEmits(['success']);

  type Spareparts = {
    sparepartsName: string;
    quantity: number;
  };

  const sparepartsData = ref<Spareparts[]>([]);

  const { createMessage: msg } = useMessage();
  const customerStore = useCustomerStore();
  const record = ref<IEquipmentMaintenanceHistories>();
  const isUpdate = ref<boolean>(true);

  /**
   * @description: form schema
   */

  const columnn = [
    { title: 'STT', dataIndex: 'stt', align: 'center' },
    { title: 'Tên phụ tùng', dataIndex: 'sparepartsName', align: 'center' },
    { title: 'Số lượng', dataIndex: 'quantity', align: 'center' },
  ];

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 120,
    layout: 'vertical',
    baseColProps: { span: 24 },
    rowProps: { gutter: 10 },
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    record.value = data.record;
    sparepartsData.value = data.record.spareparts;
    setFieldsValue({
      ...data.record,
    });

    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = 'Thông tin phụ tùng thay thế';

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      if (!unref(isUpdate)) {
        // Force create
        await customerStore
          .create(values)
          .then((res) => {
            if (res) {
              msg.success('Thao tác thành công');
              emit('success', {}); // Emit success
              closeModal();
            } else msg.error('Thao tác thất bại');
          })
          .catch((error) => {
            msg.error(error.message);
          });
      } else {
        // Force update
        await customerStore
          .update({ ...values, id: record.value?.id ?? null })
          .then((res) => {
            if (res) {
              msg.success('Thao tác thành công');
              emit('success', {}); // Emit success
              closeModal();
            } else msg.error('Thao tác thất bại');
          })
          .catch((error) => {
            msg.error(error.message);
          });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>
