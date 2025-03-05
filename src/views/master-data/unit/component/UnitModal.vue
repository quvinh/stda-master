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
  import { IUnit } from '@/api/model/IUnit';
  import { createUnitApi, updateUnitApi } from '@/api/sys/unit';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const record = ref<IUnit>();
  const isUpdate = ref<boolean>(true);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    // {
    //   field: 'id',
    //   label: 'Mã đơn vị tính',
    //   component: 'Input',
    //   required: true,
    //   colProps: { span: 24 },
    // },
    {
      field: 'name',
      label: 'Đơn vị tính',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
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

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
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
        await createUnitApi(values)
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
        const res: any = await updateUnitApi({ ...values, id: record.value?.id ?? null });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>
