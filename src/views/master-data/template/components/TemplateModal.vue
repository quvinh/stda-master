<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ITemplate } from '@/api/model/ITemplate';
  import { createTemplateApi, updateTemplateApi } from '@/api/sys/template';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Tinymce } from '@/components/Tinymce';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, h, ref, unref } from 'vue';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const record = ref<ITemplate>();
  const isUpdate = ref<boolean>(true);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'slug',
      label: 'Slug',
      component: 'Input',
      required: true,
      rules: [{ max: 100 }],
      colProps: { span: 12 },
    },
    {
      field: 'name',
      label: 'Template',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'height',
      label: 'Chiều cao (mm)',
      component: 'InputNumber',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'width',
      label: 'Chiều rộng (mm)',
      component: 'InputNumber',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'description',
      label: 'Mô tả',
      component: 'Input',
      rules: [{ max: 200 }],
      colProps: { span: 24 },
    },
    {
      field: 'content',
      label: 'Nội dung',
      component: 'Input',
      render: ({ model, field }) => {
        return h(Tinymce, {
          value: model[field],
          showImageUpload: false,
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
  ];

  const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
    labelWidth: 150,
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
    } else {
      setFieldsValue({
        content: '<p>Content...</p>',
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
        const res: any = await createTemplateApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        // Force update
        const res: any = await updateTemplateApi({ ...values, id: record.value?.id ?? null });
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
