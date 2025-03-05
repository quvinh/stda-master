<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :showOkBtn="false"
  >
    <Descriptions bordered :column="3" size="small">
      <DescriptionsItem label="Đơn sản xuất">{{ record.batch_code }}</DescriptionsItem>
      <DescriptionsItem label="Máy">{{ record.equipment_id }}</DescriptionsItem>
      <DescriptionsItem label="Bắt đầu sản xuất"
        >{{ dayjs(record.start_time).format('DD/MM/YYYY HH:mm') }}
      </DescriptionsItem>
      <DescriptionsItem label="Kết thúc sản xuất"
        >{{ dayjs(record.end_time).format('DD/MM/YYYY') }}
      </DescriptionsItem>
      <DescriptionsItem label="Mã thành phẩm">{{ record.product_id }}</DescriptionsItem>
      <DescriptionsItem label="Tên thành phẩm">{{ record.product?.product_name }}</DescriptionsItem>
    </Descriptions>
    <br />
    <Table
      size="small"
      :columns="columnns"
      :dataSource="record?.lots ?? []"
      bordered
      :pagination="true"
    />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useForm } from '@/components/Form';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useCustomerStore } from '@/store/modules/states/customer';
  import { Descriptions, DescriptionsItem, Table } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { ColumnsType } from 'ant-design-vue/lib/table';
  import ILot from '@/api/model/ILot';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const customerStore = useCustomerStore();
  const record = ref<any>({});
  const isUpdate = ref<boolean>(true);

  /**
   * @description: form schema
   */

  const columnns: ColumnsType<ILot> = [
    { title: 'Mã lot', dataIndex: 'id', align: 'center' },
    {
      title: 'Số lượng kế hoạch',
      align: 'center',
      customRender: ({ record }) => record.lot_plan?.quantity,
    },
    {
      title: 'Lot size',
      align: 'center',
      customRender: ({ record }) => record.lot_plan?.lot_size,
    },
    {
      title: 'Thời gian bắt đầu',
      align: 'center',
      customRender: ({ record }) => record.lot_plan?.start_time,
    },
    {
      title: 'Thời gian kết thúc',
      align: 'center',
      customRender: ({ record }) => record.lot_plan?.end_time,
    },
  ];

  const [, { setFieldsValue, resetFields, validate }] = useForm({
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
    setFieldsValue({
      ...data.record,
    });

    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = 'Thông tin đơn';

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
