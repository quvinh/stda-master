<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Chi tiết kiểm tra"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useMessage } from '@/hooks/web/useMessage';
  import dayjs from 'dayjs';

  import customParseFormat from 'dayjs/plugin/customParseFormat';
  import { updateMaintenanceLog } from '@/api/sys/equipment-maintenance-schedules';
  import { uploadApi } from '@/api/sys/equipment-maintenance-histories';

  dayjs.extend(customParseFormat);

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'ID',
      component: 'Input',
      colProps: { span: 0 },
    },
    {
      field: 'equipment_id',
      label: 'Mã máy',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'planed_date',
      label: 'Kế hoạch',
      component: 'DatePicker',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        class: 'w-full',
      },
    },
    {
      field: 'category_name',
      label: 'Nhóm hạng mục',
      component: 'Input',
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'executed_date',
      label: 'Ngày thực hiện',
      component: 'DatePicker',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        class: 'w-full',
      },
    },
    {
      field: 'item_name',
      label: 'Tên công việc',
      component: 'Input',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'result',
      label: 'Kết quả',
      component: 'Input',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'note',
      label: 'Nhận xét',
      component: 'Input',
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'proof',
      label: 'Bằng chứng',
      component: 'ImageUpload',
      colProps: { span: 12 },
      componentProps: {
        accept: ['png', 'jpg', 'jpeg'],
        api: uploadImages,
        name: 'image',
        multiple: true,
        maxNumber: 5,
      },
    },
  ];

  const [registerForm, { setFieldsValue, resetFields, validate, getFieldsValue }] = useForm({
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
    if (data?.record) {
      setFieldsValue({
        ...data.record,
        planed_date: data.record?.planed_date
          ? dayjs(data.record?.planed_date, 'DD/MM/YYYY')
          : null,
        executed_date: data.record?.executed_date
          ? dayjs(data.record?.executed_date, 'DD/MM/YYYY')
          : null,
      });
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      const res = await updateMaintenanceLog(values);
      if (res.success) {
        msg.success('Thao tác thành công');
      }
      emit('success', {}); // Emit success
      closeModal();
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  async function uploadImages(params, onUploadProgress) {
    try {
      const res = await uploadApi(params, onUploadProgress);
      var { proof } = getFieldsValue();
      setFieldsValue({ proof: [...(proof ?? []), res] });
      return res;
    } catch (error) {
      console.error(error);
    }
  }
</script>
