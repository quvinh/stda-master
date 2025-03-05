<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { IErrorEquipment } from '@/api/model/IErrorEquipment';
  import { searchEquipmentApi } from '@/api/sys/equipment';
  import { createErrorEquipmentApi, updateErrorEquipmentApi } from '@/api/sys/error-equipment';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const equipmentsOptions = ref<{ label: string; value: string }[]>([]);
  const record = ref<IErrorEquipment>();
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
      field: 'equipment_id',
      label: 'Mã thiết bị',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'reason',
      label: 'Nguyên nhân',
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      field: 'fix',
      label: 'Cách khắc phục',
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      field: 'protection_measures',
      label: 'Biện pháp bảo vệ',
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
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
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
        const res: any = await createErrorEquipmentApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        // Force update
        const res: any = await updateErrorEquipmentApi({ ...values, id: record.value?.id ?? null });
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
  const fetchEquipment = async (param: any = {}) => {
    try {
      const response: any = await searchEquipmentApi(param);
      //set Data
      equipmentsOptions.value = (response.data || []).map((item) => ({
        label: item.equipment_name,
        value: item.id,
      }));
      updateSchema({
        field: 'equipment_id',
        componentProps: {
          options: equipmentsOptions.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };
</script>
