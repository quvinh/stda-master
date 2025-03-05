<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, h } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useMessage } from '@/hooks/web/useMessage';
  import { IApplicationSetting } from '@/api/model/IApplicationSetting';
  import {
    createApplicationSettingApi,
    updateApplicationSettingApi,
  } from '@/api/sys/application-setting';
  import { CodeEditor, MODE } from '@/components/CodeEditor';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const record = ref<IApplicationSetting>();
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
      colProps: { span: 12 },
    },
    {
      field: 'name',
      label: 'Name config',
      component: 'Input',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'setting_type',
      label: 'Setting type',
      component: 'Select',
      required: true,
      colProps: { span: 12 },
      defaultValue: 'string',
      componentProps: {
        options: [
          { label: 'boolean', value: 'boolean' },
          { label: 'option', value: 'option' },
          { label: 'string', value: 'string' },
        ],
        allowClear: false,
      },
    },
    {
      field: 'boolean_value',
      label: 'Boolean value',
      component: 'Select',
      colProps: { span: 12 },
      defaultValue: 0,
      componentProps: {
        options: [
          { label: 'YES', value: 1 },
          { label: 'NO', value: 0 },
        ],
        allowClear: false,
      },
    },
    {
      field: 'options',
      label: 'Options meta',
      component: 'Input',
      colProps: { span: 24 },
      defaultValue: '{"name": "option", "description": "demo"}',
      rules: [{ required: true, trigger: 'blur' }],
      render: ({ model, field }) => {
        return h(CodeEditor, {
          value: model[field],
          mode: MODE.JSON,
          onChange: (value: string) => {
            model[field] = value;
          },
          config: {
            tabSize: 10,
          },
        });
      },
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
        boolean_value: data.record?.boolean_value ? 1 : 0,
        options: data.record?.options ? JSON.stringify(data.record.options) : null,
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
        await createApplicationSettingApi({
          ...values,
          options: JSON.parse(values.options ?? '{}'),
        })
          .then((res) => {
            if (res) {
              msg.success('Thao tác thành công');
              emit('success', {}); // Emit success
              closeModal();
            } else msg.error('Thao tác thất bại');
          })
          .catch((error) => {
            console.error(error.message);
          });
      } else {
        // Force update
        const res: any = await updateApplicationSettingApi({
          ...values,
          id: record.value?.id ?? null,
          options: JSON.parse(values.options ?? '{}'),
        });
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
