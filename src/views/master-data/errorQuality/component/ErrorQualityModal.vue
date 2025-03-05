<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import IErrorQuality from '@/api/model/IErrorQuality';
  import { createErrorQualityApi, updateErrorQualityApi } from '@/api/sys/error-quality';
  import { searchProcessApi } from '@/api/sys/process';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const processOptions = ref<{ label: string; value: string }[]>([]);
  const record = ref<IErrorQuality>();
  const isUpdate = ref<boolean>(true);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'Mã lỗi',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'name',
      label: 'Tên lỗi',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'process_id',
      label: 'Công đoạn',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'type',
      label: 'Loại',
      component: 'Select',
      componentProps: {
        options: [
          { value: 'iqc', label: 'IQC' },
          { value: 'pqc', label: 'PQC' },
          { value: 'oqc', label: 'OQC' },
        ],
      },
      colProps: { span: 24 },
    },
    {
      field: 'description',
      label: 'Mô tả',
      component: 'Input',
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
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    fetchProcess();
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({
        ...data.record,
      });
    }
    updateSchema({
      field: 'id',
      componentProps: {
        disabled: unref(isUpdate),
      },
    });
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values: any = await validate();
      if (!unref(isUpdate)) {
        // Force create
        const res: any = await createErrorQualityApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        // Force update
        const res: any = await updateErrorQualityApi({ ...values, id: record.value?.id ?? null });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  const fetchProcess = async (param: any = {}) => {
    try {
      const response: any = await searchProcessApi(param);
      //set Data
      processOptions.value = (response.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'process_id',
        componentProps: {
          options: processOptions.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };
</script>
