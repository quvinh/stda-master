<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { IProduct } from '@/api/model/IProduct';
  import { createProductApi, updateProductApi } from '@/api/sys/product';
  import { searchUnitApi } from '@/api/sys/unit';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useProductCategoryStore } from '@/store/modules/states/productCategory';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);
  const { createMessage: msg } = useMessage();
  const productCategoryStore = useProductCategoryStore();
  const productCategoryOptions = ref<{ label: string; value: string }[]>([]);
  const unitOptions = ref<{ label: string; value: string }[]>([]);

  const record = ref<IProduct>();
  const isUpdate = ref<boolean>(true);

  // setting form schema
  const getFormSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'Mã sản phẩm',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 24 },
    },
    {
      field: 'name',
      label: 'Tên sản phẩm',
      component: 'Input',
      required: true,
      rules: [{ max: 255 }],
      colProps: { span: 24 },
    },
    {
      field: 'unit_id',
      label: 'Đơn vị',
      component: 'Select',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        options: unitOptions.value,
        allowClear: false,
      },
    },
    {
      field: 'have_pqc',
      label: 'Cần kiểm tra PQC',
      component: 'Select',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: 'Có', value: 1 },
          { label: 'Không', value: 0 },
        ],
        allowClear: false,
      },
    },
    {
      field: 'product_category_id',
      label: 'Loại sản phẩm',
      component: 'Select',
      colProps: { span: 24 },
      componentProps: {
        options: productCategoryOptions.value,
        allowClear: true,
      },
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
    fetchProductCategory();
    fetchUnitCategory();
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({ ...data.record, have_pqc: data.record?.have_pqc ? 1 : 0 });
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
      if (!unref(isUpdate)) {
        const res: any = await createProductApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        const res: any = await updateProductApi({ ...values, id: record.value?.id ?? null });
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

  const fetchProductCategory = async (param: any = {}) => {
    try {
      const response = await productCategoryStore.search(param);
      //set Data
      productCategoryOptions.value = (response.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'product_category_id',
        componentProps: {
          options: productCategoryOptions.value,
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
