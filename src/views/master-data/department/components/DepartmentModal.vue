<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useMessage } from '@/hooks/web/useMessage';
  import { IDepartment } from '@/api/model/IDepartment';
  import {
    createDepartmentApi,
    searchDepartmentApi,
    updateDepartmentApi,
  } from '@/api/sys/department';

  const emit = defineEmits(['success']);
  const { createMessage: msg } = useMessage();
  const department = ref<{ id: string; name: string }[]>([]);
  const departmentOptions = ref<{ label: string; value: string }[]>([]);
  const record = ref<IDepartment>();
  const isUpdate = ref<boolean>(false);
  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'Mã phòng ban',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 24 },
    },
    {
      field: 'name',
      label: 'Tên phòng ban',
      component: 'Input',
      required: true,
      rules: [{ max: 255 }],
      colProps: { span: 24 },
    },
    {
      field: 'parent_id',
      label: 'Thuộc phòng ban',
      component: 'Select',
      rules: [{ max: 200 }],
      colProps: { span: 24 },
      componentProps: {
        options: departmentOptions.value,
        allowClear: true,
      },
    },
  ];
  const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
    labelWidth: 120,
    layout: 'vertical',
    rowProps: { gutter: 10 },
    schemas: getFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  async function fetchDepartment(param: any = {}) {
    try {
      const response: any = await searchDepartmentApi(param);
      // Set data
      department.value = response.data ?? [];
      departmentOptions.value = department.value.map((dept) => ({
        label: dept.name,
        value: dept.id,
      }));
      updateSchema([
        {
          field: 'id',
          componentProps: {
            disabled: unref(isUpdate),
          },
        },
        {
          field: 'parent_id',
          componentProps: {
            options: departmentOptions.value,
            allowClear: true,
          },
        },
      ]);
    } catch (error) {
      msg.error(error.message);
    }
  }

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    fetchDepartment();
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      console.log(data.record);
      setFieldsValue({
        ...data.record,
      });
    }
    setModalProps({ loading: false, confirmLoading: false });
  });
  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));
  const handleSubmit = async () => {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values: any = await validate();
      if (values.parent_id === undefined) values.parent_id = null;
      if (!unref(isUpdate)) {
        await createDepartmentApi(values)
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
        await updateDepartmentApi({ ...values, id: record.value?.id ?? null })
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
