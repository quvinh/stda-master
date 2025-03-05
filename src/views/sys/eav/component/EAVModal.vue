<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { createEAVApi, updateEAVApi } from '@/api/sys/eav';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const record = ref<any>();
  const filter = ref<any>();
  const isUpdate = ref<boolean>(true);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'name',
      label: 'Tên cột',
      component: 'Input',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'plural_name',
      label: 'Tên cột (số nhiều)',
      component: 'Input',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'display_name',
      label: 'Tên hiển thị',
      component: 'Input',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'attribute_type',
      label: 'Loại giá trị',
      component: 'Select',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: 'string', value: 'string' },
          { label: 'integer', value: 'integer' },
          { label: 'boolean', value: 'boolean' },
          { label: 'decimal', value: 'decimal' },
        ],
        allowClear: false,
      },
    },
    {
      field: 'display_order',
      label: 'Thứ tự hiển thị',
      component: 'InputNumber',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        min: 0,
      },
    },
    {
      field: 'is_required',
      label: 'Trường bắt buộc',
      component: 'Select',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: 'Có', value: 1 },
          { label: 'Không', value: 0 },
        ],
      },
    },
  ];

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 180,
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
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({
        ...data.record,
        is_required: data.record?.is_required ? 1 : 0,
      });
    }
    filter.value = data?.filter;
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values: any = await validate();
      if (!unref(isUpdate)) {
        // Force create
        const res: any = await createEAVApi({ ...values, ...filter.value });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        // Force update
        if (!record.value?.id) return;
        const res: any = await updateEAVApi(record.value.id, { ...values, ...filter.value });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>
