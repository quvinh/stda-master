<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <Table
      size="small"
      :loading="loading"
      :columns="columnsModal"
      :dataSource="dataModal"
      :bordered="true"
      :pagination="false"
      :locale="{ emptyText: '&nbsp' }"
      :scroll="{ x: 500 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                // label: 'Sửa',
                icon: 'ant-design:edit-outlined',
                // onClick: handleUpdate.bind(null, record),
              },
              {
                // label: 'Xóa',
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: 'Xác nhận xóa?',
                  placement: 'topLeft',
                  // confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </Table>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useCustomerStore } from '@/store/modules/states/customer';
  import { ICustomer } from '@/api/model/ICustomer';
  import { Table } from 'ant-design-vue';
  import { ColumnType } from 'ant-design-vue/es/table';
  import { TableAction } from '@/components/Table';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const loading = ref<boolean>(false);
  const customerStore = useCustomerStore();
  const record = ref<ICustomer>();
  const isUpdate = ref<boolean>(true);

  const columnsModal: ColumnType[] = [
    { title: 'STT', dataIndex: 'stt' },
    { title: 'Công đoạn', dataIndex: 'process' },
    { title: 'Mã máy', dataIndex: 'equipment_id' },
    { title: 'Đơn vị sử dụng', dataIndex: 'unit' },
    { title: 'Ngày bảo dưỡng', dataIndex: 'maintenance_date' },
    { title: 'Thời gian BĐ KH', dataIndex: 'start_time' },
    { title: 'Thời gian KT KH', dataIndex: 'end_time' },
    { title: 'Người bảo dưỡng', dataIndex: 'maintenance_user' },
    { title: 'Ghi chú', dataIndex: 'note' },
    { title: 'Trạng thái', dataIndex: 'status' },
    { title: 'Thao tác', dataIndex: 'action', width: 100 },
  ];

  const dataModal = ref([
    {
      stt: 1,
      process: '',
      equipment_id: '',
    },
  ]);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'customer_name',
      label: 'Tên khách hàng',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'phone',
      label: 'SĐT',
      component: 'Input',
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'email',
      label: 'Email',
      component: 'Input',
      rules: [{ type: 'email' }],
      colProps: { span: 12 },
    },
    {
      field: 'address',
      label: 'Địa chỉ',
      component: 'Input',
      rules: [{ max: 200 }],
    },
  ];

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 120,
    layout: 'vertical',
    baseColProps: { span: 24 },
    rowProps: { gutter: 10 },
    schemas: getFormSchema,
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
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({
        ...data.record,
      });
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      console.log(values);
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
