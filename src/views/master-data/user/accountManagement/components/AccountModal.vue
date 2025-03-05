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
  import { ISelectOption } from '@/store/types/pagination';
  import { useUserStore } from '@/store/modules/user';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const userStore = useUserStore();
  const departments = ref<ISelectOption[]>([]);
  const roles = ref<ISelectOption[]>([]);
  const record = ref<any>();
  const isUpdate = ref<boolean>(false);
  const loading = ref(false);

  /**
   * @description: form schema
   */
  const getFormSchema: FormSchema[] = [
    {
      field: 'department_id',
      label: 'Phòng ban',
      component: 'Select',
      required: true,
      // rules: [{ max: 200 }],
      colProps: { span: 12 },
      componentProps: {
        options: departments.value,
        mode: 'multiple',
      },
    },
    {
      field: 'roles_id',
      label: 'Vai trò',
      component: 'Select',
      required: true,
      // rules: [{ max: 200 }],
      colProps: { span: 12 },
      componentProps: {
        options: roles.value,
        mode: 'multiple',
      },
    },
    {
      field: 'name',
      label: 'Tên tài khoản',
      component: 'Input',
      rules: [{ max: 200 }],
      colProps: { span: 12 },
      dynamicRules: () => {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject('Tên tài khoản không thể trống');
              }
              return Promise.resolve();
            },
          },
        ];
      },
    },
    {
      field: 'email',
      label: 'Email',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'username',
      label: 'Tên đăng nhập',
      component: 'Input',
      colProps: { span: 12 },
      dynamicRules: () => {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject('Tên đăng nhập không thể trống');
              }
              return Promise.resolve();
            },
          },
        ];
      },
    },
    {
      field: 'password',
      label: 'Mật khẩu',
      component: 'InputPassword',
      colProps: { span: 12 },
      dynamicRules: () => {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (!value && !isUpdate.value) {
                return Promise.reject('Mật khẩu không thể trống');
              }
              return Promise.resolve();
            },
          },
        ];
      },
    },
  ];

  const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
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
    departments.value = data.department;
    roles.value = data.role;
    if (unref(isUpdate)) {
      loading.value = true;
      record.value = data.record;
      setFieldsValue({
        ...data.record,
        department_id: data.record.departments?.map((i) => i.id),
        roles_id: data.record.roles?.map((i) => i.id),
      });
      updateSchema({
        field: 'password',
        show: false,
      });
    } else {
      updateSchema({
        field: 'password',
        show: true,
      });
    }
    updateSchema([
      {
        field: 'roles_id',
        componentProps: {
          options: roles.value,
        },
      },
      {
        field: 'department_id',
        componentProps: {
          options: departments.value,
        },
      },
    ]);
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      if (!unref(isUpdate)) {
        // Force create
        await userStore
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
        await userStore
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
