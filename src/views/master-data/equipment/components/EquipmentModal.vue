<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { IEquipment } from '@/api/model/IEquipment';
  import { createEquipmentApi, updateEquipmentApi } from '@/api/sys/equipment';
  import { searchProcessApi } from '@/api/sys/process';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);

  const processOption = ref<{ label: string; value: string }[]>([]);
  const { createMessage: msg } = useMessage();

  const record = ref<IEquipment>();
  const isUpdate = ref<boolean>(true);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    // {
    //   field: 'id',
    //   label: 'ID',
    //   component: 'Input',
    //   required: true,
    //   rules: [{ max: 200 }],
    //   colProps: { span: 12 },
    // },
    {
      field: 'id',
      label: 'Mã thiết bị',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'name',
      label: 'Tên thiết bị',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },

    {
      field: 'process_id',
      label: 'Mã công đoạn',
      component: 'Select',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
      componentProps: {
        options: processOption.value,
        allowClear: true,
      },
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
    fetchProcess();
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

  const fetchProcess = async (param: any = {}) => {
    try {
      const response: any = await searchProcessApi(param);

      //set Data
      processOption.value = (response.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'process_id',
        componentProps: {
          options: processOption.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };
  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values: any = await validate();
      if (!unref(isUpdate)) {
        // Force create
        const res: any = await createEquipmentApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        // Force update
        const res: any = await updateEquipmentApi({ ...values, id: record.value?.id ?? null });
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
