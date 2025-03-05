<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useAcceptanceQualityLimitStore } from '@/store/modules/states/acceptanceQualityLimit';
  import { IAcceptanceQualityLimit } from '@/api/model/IAcceptanceQualityLimit';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const acceptance = ref<{ id: string; name: string }[]>([]);
  const acceptanceOptions = ref<{ label: string; value: string }[]>([]);

  const acceptanceStore = useAcceptanceQualityLimitStore();
  const record = ref<IAcceptanceQualityLimit>();
  const isUpdate = ref<boolean>(true);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'Mã',
      component: 'InputNumber',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'product_name',
      label: 'Sản phẩm',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'sampling_quantity',
      label: 'SL bốc mẫu',
      component: 'InputNumber',
      colProps: { span: 12 },
    },
    {
      field: 'standard',
      label: 'Tiêu chuẩn',
      component: 'Input',
      colProps: { span: 12 },
    },
    {
      field: 'standard_code',
      label: 'Standard code',
      component: 'Input',
      colProps: { span: 12 },
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

  async function fetchAcceptanceQualityLimit(param: any = {}) {
    try {
      const response = await acceptanceStore.search(param);
      // Set data
      acceptance.value = response.data ?? [];
      acceptanceOptions.value = acceptance.value.map((dept) => ({
        label: dept.name,
        value: dept.id,
      }));
      // updateSchema({
      //   field: 'parent_id',
      //   componentProps: {
      //     options: acceptanceOptions.value,
      //     allowClear: true,
      //   },
      // });
    } catch (error) {
      msg.error(error.message);
    }
  }

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    fetchAcceptanceQualityLimit();
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
      const values = await validate();
      if (!unref(isUpdate)) {
        // Force create
        await acceptanceStore
          .create(values)
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
      } else {
        // Force update
        await acceptanceStore
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
  }
</script>
