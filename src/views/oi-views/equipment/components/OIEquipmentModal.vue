<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Nhập thông tin lỗi dừng máy"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useMessage } from '@/hooks/web/useMessage';
  import { searchErrorEquipmentApi } from '@/api/sys/error-equipment';
  import { updateErrorEquipmentLogApi } from '@/api/sys/error-equipment-log';

  interface Error {
    equipment_id: string;
    error_equipment_name: string;
    fix: string;
    id: string;
    reason: string;
    protection_measures: string;
  }

  const emit = defineEmits(['success']);
  const { createMessage: msg } = useMessage();
  const isUpdate = ref<boolean>(true);
  const idSelected = ref<number>(-1);
  const errorList = ref<{ label: string; value: string }[]>([]);
  const myMap = new Map<string, string>();
  const errors = ref<any[]>([]);

  const loadErrorList = async () => {
    const res: any = await searchErrorEquipmentApi({});
    errors.value = res?.map((item: Error) => ({
      ...item,
      value: item.id,
      label: item.error_equipment_name,
    }));
  };

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    // {
    //   field: 'id',
    //   label: 'Mã lỗi',
    //   component: 'Input',
    //   required: true,
    //   colProps: { span: 24 },
    // },
    {
      field: 'error_equipment_id',
      label: 'Tên lỗi',
      component: 'Select',
      // required: true,
      colProps: { span: 24 },
      componentProps: {
        options: errors.value,
        showSearch: true,
        onChange: (e) => {
          handleSelect(e);
        },
      },
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
      label: 'Phòng ngừa',
      component: 'Input',
      colProps: { span: 24 },
    },
  ];

  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
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
    await loadErrorList();
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      idSelected.value = data.idSelected;
      errorList.value = data.errorList;
      errorList.value.forEach((i) => {
        myMap.set(i.value, i.label);
      });
      updateSchema({
        field: 'error_equipment_id',
        componentProps: {
          options: errors.value,
        },
      });
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      console.log('values = ', values);
      const res: any = await updateErrorEquipmentLogApi({
        ...values,
        id: idSelected.value,
      });
      if (res) {
        msg.success('Thao tác thành công');
        emit('success', {}); // Emit success
        closeModal();
      } else msg.error('Thao tác thất bại');
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  async function handleSelect(value) {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const data = errors.value?.find((item: Error) => item.id === value);
      if (data) {
        setFieldsValue({
          reason: data.reason,
          fix: data.fix,
          protection_measures: data.protection_measures,
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>
