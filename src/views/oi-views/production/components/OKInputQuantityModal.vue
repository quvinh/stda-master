<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="textInputOk.text"
    @ok="handleSubmit"
  >
    <template v-if="record?.lot_id && textInputOk.status !== 'waiting_for_fai'">
      <div class="flex flex-col info-container">
        <small class="font-semibold">Số lượng hiện tại: {{ record?.actual_quantity }}</small>
        <small class="font-semibold">Số lượng NG hiện tại: {{ record?.ng_quantity }}</small>
        <small class="font-semibold"
          >Số lượng OK hiện tại:
          {{ (record?.actual_quantity ?? 0) - (record?.ng_quantity ?? 0) }}</small
        >
      </div>
    </template>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import ApiResponse from '@/api/ApiResponse';
  import axiosInstance from '@/api/resource/axiosInstance';

  const emit = defineEmits(['success']);

  const record = ref<any>();
  const textInputOk = ref<{ text: string; status: string }>({
    text: 'Nhập số lượng OK',
    status: '',
  });
  // const countNG = ref(0);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'ok_quantity',
      label: ' Nhập SL OK',
      component: 'InputNumber',
      required: true,
      defaultValue: 0,
      labelWidth: 250,
      colProps: { span: 24 },
    },
  ];

  const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
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
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    setFieldsValue({
      ok_quantity: data?.actual_quantity || 0,
    });
    console.log(data);
    if (data?.actual_quantity) {
      updateSchema({
        field: 'ok_quantity',
        componentProps: { min: Number(data.actual_quantity) },
      });
    }
    if (data?.status && data?.status === 'waiting_for_fai') {
      textInputOk.value = { text: 'Nhập số lượng thử bài', status: 'waiting_for_fai' };
      updateSchema({
        field: 'ok_quantity',
        label: 'Nhập số lượng thử bài',
      });
      setFieldsValue({
        ok_quantity: data?.planned_quantity || 0,
      });
    }
    record.value = data ?? null;
    setModalProps({ loading: false, confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      if (record.value?.lot_id) {
        const response: ApiResponse = await axiosInstance.post('v1/manufacture/manual-update', {
          lot_id: record.value?.lot_id,
          quantity: values.ok_quantity,
        });
        if (response?.success) {
          emit('success', {});
          closeModal();
        }
      } else {
        message.error('Không tìm thấy số lot sản xuất');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>

<style scoped>
  .info-container {
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom-width: 1px;
    border-bottom-color: #dadae3;
  }
</style>
