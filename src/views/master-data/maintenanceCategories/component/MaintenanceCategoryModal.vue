<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { IStandardParameter } from '@/api/model/IStandardParameter';
  import { updateApi, createApi } from '@/api/sys/equipment-maintenance-categories';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const record = ref<IStandardParameter>();
  const isUpdate = ref<boolean>(true);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'name',
      label: 'Tên hạng mục',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'description',
      label: 'Mô tả',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
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
      });
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values: any = await validate();
      if (!unref(isUpdate)) {
        // Force create
        const res: any = await createApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        // Force update
        const res: any = await updateApi({
          ...values,
          id: record.value?.id ?? null,
        });
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
</script>
