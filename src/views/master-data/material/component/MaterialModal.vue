<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { IMaterial } from '@/api/model/IMaterial';
  import { createMaterialApi, updateMaterialApi } from '@/api/sys/material';
  import { searchMaterialCategoryApi } from '@/api/sys/material-category';
  import { searchUnitApi } from '@/api/sys/unit';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);
  const { createMessage: msg } = useMessage();
  const materialCategoryOptions = ref<{ label: string; value: string }[]>([]);
  const unitOptions = ref<{ label: string; value: string }[]>([]);

  const record = ref<IMaterial>();
  const isUpdate = ref<boolean>(true);

  // setting form schema
  const getFormSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'Mã NVL',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 24 },
    },
    {
      field: 'name',
      label: 'Tên NVL',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 24 },
    },
    {
      field: 'material_category_id',
      label: 'Danh mục NVL',
      component: 'Select',
      colProps: { span: 24 },
      componentProps: {
        options: materialCategoryOptions.value,
        allowClear: true,
      },
    },
    {
      field: 'unit_id',
      label: 'Đơn vị',
      component: 'Select',
      colProps: { span: 12 },
      componentProps: {
        options: unitOptions.value,
        allowClear: true,
      },
    },
    {
      field: 'class',
      label: 'Class',
      component: 'Input',
      colProps: { span: 12 },
      rules: [{ max: 200 }],
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
    fetchMaterialCategory();
    fetchUnitCategory();
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({ ...data.record });
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

  const handleSubmit = async () => {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values: any = await validate();
      console.log(values);
      if (!unref(isUpdate)) {
        const res: any = await createMaterialApi({ ...values, type: 1 }); // Mặc định là nguyên vật liệu
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        const res: any = await updateMaterialApi({
          ...values,
          id: record.value?.id ?? null,
          type: 1, // Mặc định là nguyên vật liệu
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
  };

  const fetchMaterialCategory = async (param: any = {}) => {
    try {
      const response: any = await searchMaterialCategoryApi(param);
      //set Data
      materialCategoryOptions.value = (response.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'material_category_id',
        componentProps: {
          options: materialCategoryOptions.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };

  const fetchUnitCategory = async (param: any = {}) => {
    try {
      const response: any = await searchUnitApi(param);
      //set Data
      unitOptions.value = (response.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'unit_id',
        componentProps: {
          options: unitOptions.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };
</script>
