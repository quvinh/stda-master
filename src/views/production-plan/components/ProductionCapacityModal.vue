<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import ISpec from '@/api/model/ISpec';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useEquipmentStore } from '@/store/modules/states/equipment';
  import { useProcessStore } from '@/store/modules/states/process';
  import { useProductStore } from '@/store/modules/states/product';
  import { useSpecStore } from '@/store/modules/states/spec';
  import { message } from 'ant-design-vue';
  import { computed, ref, unref } from 'vue';

  const emit = defineEmits(['success']);
  const { createMessage: msg } = useMessage();
  const productStore = useProductStore();
  const processStore = useProcessStore();
  const equipmentStore = useEquipmentStore();
  const products = ref<{ label: string; value: string }[]>([]);
  const equipments = ref<{ label: string; value: string }[]>([]);
  const process = ref<{ label: string; value: string }[]>([]);
  const record = ref<ISpec>();
  const isUpdate = ref<boolean>(true);
  const specStore = useSpecStore();
  const loading = ref<boolean>(false);

  // setting form schema
  const getFormSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'product_id',
      label: 'Tên sản phẩm',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        options: products.value,
      },
    },
    {
      field: 'process_id',
      label: 'Tên công đoạn',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        options: process.value,
      },
    },
    {
      field: 'equipment_id',
      label: 'Tên máy',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        options: equipments.value,
      },
    },
    {
      field: 'operation',
      label: 'Operation',
      component: 'Input',
      rules: [{ max: 200 }],
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
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    fetchProcess();
    fetchEquipment();
    fetchProduct();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({ ...data.record, id: record.value?.id });
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  async function fetchProduct(param: any = {}) {
    try {
      loading.value = true;
      const response = await productStore.search(param);
      // Set data
      const productData = response.data ?? [];
      products.value = productData.map((i) => ({
        label: i.product_name,
        value: i.id,
      }));
      updateSchema({
        field: 'product_id',
        componentProps: {
          options: products.value,
        },
      });
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function fetchProcess(param: any = {}) {
    try {
      loading.value = true;
      const response = await processStore.search(param);
      // Set data
      const processData = response.data ?? [];
      process.value = processData.map((i) => ({
        label: i.name,
        value: i.id,
      }));
      updateSchema({
        field: 'process_id',
        componentProps: {
          options: process.value,
        },
      });
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function fetchEquipment(param: any = {}) {
    try {
      loading.value = true;
      const response = await equipmentStore.search(param);
      // Set data
      const equipmentData = response.data ?? [];
      equipments.value = equipmentData.map((i) => ({
        label: i.equipment_name,
        value: i.id,
      }));
      updateSchema({
        field: 'equipment_id',
        componentProps: {
          options: equipments.value,
        },
      });
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  const handleSubmit = async () => {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      console.log(values);
      if (!unref(isUpdate)) {
        await specStore
          .create(values)
          .then((res) => {
            if (res) {
              msg.success('Thao tác thành công');
              emit('success', {});
              closeModal();
            } else msg.error('Thao tác thất bại');
          })
          .catch((error) => {
            msg.error(error.message);
          });
      } else {
        await specStore
          .update({ ...values, id: record.value?.id ?? null })
          .then((res) => {
            if (res) {
              msg.success('Thao tác thành công');
              emit('success', {}); // Emit success
              closeModal();
            } else msg.error('Thao tác thất bại');
          })
          .catch((error) => {
            msg.error(error.message);
          });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  };
</script>
