<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { IWarehouseLocation } from '@/api/model/IWarehouseLocation';
  import { searchWarehouseApi } from '@/api/sys/warehouse';
  import {
    createWarehouseLocationApi,
    updateWarehouseLocationApi,
  } from '@/api/sys/warehouse-location';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const record = ref<IWarehouseLocation>();
  const isUpdate = ref<boolean>(true);
  const warehouseOption = ref<{ label: string; value: string }[]>([]);
  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'Mã vị trí',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'warehouse_id',
      label: 'Mã kho',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        options: warehouseOption.value,
        allowClear: true,
      },
    },
    {
      field: 'location_type',
      label: 'Loại vị trí',
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      field: 'capacity',
      label: 'Sức chứa',
      component: 'InputNumber',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        min: 1,
      },
    },
    // {
    //   field: 'x',
    //   label: 'X',
    //   component: 'Input',
    //   colProps: { span: 12 },
    // },
    // {
    //   field: 'y',
    //   label: 'Y',
    //   component: 'Input',
    //   colProps: { span: 12 },
    // },
    // {
    //   field: 'width',
    //   label: 'Width',
    //   component: 'Input',
    //   colProps: { span: 12 },
    // },
    // {
    //   field: 'height',
    //   label: 'Height',
    //   component: 'Input',
    //   colProps: { span: 12 },
    // },
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
    fetchWarehouse();
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
        const res: any = await createWarehouseLocationApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        // Force update
        const res: any = await updateWarehouseLocationApi({
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
  const fetchWarehouse = async (param: any = {}) => {
    try {
      const response: any = await searchWarehouseApi(param);
      warehouseOption.value = (response.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'warehouse_id',
        componentProps: {
          options: warehouseOption.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };
</script>
