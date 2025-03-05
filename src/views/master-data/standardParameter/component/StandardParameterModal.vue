<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { IStandardParameter } from '@/api/model/IStandardParameter';
  import { searchEquipmentApi } from '@/api/sys/equipment';
  import { searchEquipmentParameterApi } from '@/api/sys/equipment-parameter';
  import {
    createStandardParameterApi,
    updateStandardParameterApi,
  } from '@/api/sys/standard-parameter';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const equipmentParameterOptions = ref<{ label: string; value: string }[]>([]);
  const equipmentOptions = ref<{ label: string; value: string }[]>([]);
  const record = ref<IStandardParameter>();
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
    //   colProps: { span: 24 },
    // },
    {
      field: 'equipment_parameter_id',
      label: 'Mã thông số',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'equipment_id',
      label: 'Mã thiết Bị',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'standard',
      label: 'Tiêu chuẩn',
      component: 'InputNumber',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'standard_max',
      label: 'Tiêu chuẩn tối đa',
      component: 'InputNumber',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'standard_min',
      label: 'Tiêu chuẩn tối thiểu',
      component: 'InputNumber',
      required: true,
      colProps: { span: 24 },
    },
  ];

  const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
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
    fetchEquipmentParameter();
    fetchEquipment();
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
        const res: any = await createStandardParameterApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        // Force update
        const res: any = await updateStandardParameterApi({
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
  const fetchEquipmentParameter = async (param: any = {}) => {
    try {
      const response: any = await searchEquipmentParameterApi(param);
      //set Data
      equipmentParameterOptions.value = (response.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'equipment_parameter_id',
        componentProps: {
          options: equipmentParameterOptions.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };

  const fetchEquipment = async (param: any = {}) => {
    try {
      const response: any = await searchEquipmentApi(param);
      //set Data
      equipmentOptions.value = (response.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'equipment_id',
        componentProps: {
          options: equipmentOptions.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };
</script>
