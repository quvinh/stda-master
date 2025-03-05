<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="Nhập số lượng NG" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
    <span class="text-red-600">Tổng số lượng NG: {{ formatNumber(record?.quantity_ng_1) }}</span>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { message } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { updateApi } from '@/api/sys/pallet';
  import { formatNumber } from '@/utils/helper/tsxHelper';
  import { ISelectOption } from '@/store/types/pagination';
  import { searchErrorQualityApi } from '@/api/sys/error-quality';

  const emit = defineEmits(['success']);
  const listReason = ref<ISelectOption[]>([]);

  const record = ref<any>();

  onMounted(() => {
    fetchErrorMaterial();
  });

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'ng_quantity',
      label: ' Nhập SL NG',
      component: 'InputNumber',
      required: true,
      defaultValue: 0,
      colProps: { span: 24 },
      componentProps: { min: 0 },
    },
    {
      field: 'ng_reason',
      label: ' Nguyên nhân lỗi',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        options: listReason.value,
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

  async function fetchErrorMaterial() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const res: any = await searchErrorQualityApi({ type: 'iqc' });
      if (res?.data) {
        listReason.value = res.data?.map((i) => ({
          label: i?.error_quality_name,
          value: i?.id,
        }));
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
      closeModal();
    }
  }

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();

    setModalProps({ loading: true, confirmLoading: true });

    setFieldsValue({
      quantity: data?.quantity || data?.quantity_plan || 0,
    });
    updateSchema({
      field: 'ng_reason',
      componentProps: {
        options: listReason.value,
        allowClear: true,
      },
    });
    record.value = data?.data ?? null;
    setModalProps({ loading: false, confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      console.log(values);
      let quantity = Number(record.value?.quantity_1) - Number(values.ng_quantity);
      let ng_quantity = Number(record.value?.quantity_ng_1) + Number(values.ng_quantity);
      const res = await updateApi({
        ...record.value,
        quantity_1: quantity,
        quantity_2: record.value?.quantity_2,
        quantity_ng_1: ng_quantity,
        error_quality_id: values.ng_reason,
        result: 'OK',
      });
      if (res) {
        message.success('THAO TÁC THÀNH CÔNG');
        emit('success', { record: { ...record.value, ...res } });
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
