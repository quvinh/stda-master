<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="Nhập số lượng" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import { updateApi } from '@/api/sys/pallet';

  const emit = defineEmits(['success']);

  const record = ref<any>();

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'quantity',
      label: ' Nhập số lượng',
      component: 'InputNumber',
      required: true,
      defaultValue: record.value?.quantity_2,
      colProps: { span: 24 },
      componentProps: { min: 0 },
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
    record.value = data?.record ?? null;
    setFieldsValue({
      quantity: Number(record.value?.quantity_2),
    });
    if (record.value?.unit2?.unit_name) {
      updateSchema({ field: 'quantity', label: `Nhập số ${record.value.unit2.unit_name}` });
    }

    setModalProps({ loading: false, confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      let quantity = Number(values.quantity);
      record.value.quantity_2 = quantity;
      let ng_quantity = Number(record.value?.quantity_ng_1);
      const res = await updateApi({
        ...record.value,
        quantity_1: record.value?.quantity_1,
        quantity_2: quantity,
        quantity_ng_1: ng_quantity,
        unit_id_1: record.value.unit1?.id,
        unit_id_2: record.value.unit2?.id,
        result: 'OK',
      });
      if (res) {
        message.success('THAO TÁC THÀNH CÔNG');
        emit('success', { res: record.value, type: 'OK' });
      } else {
        message.error('THAO TÁC THẤT BẠI');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
      closeModal();
    }
  }
</script>
