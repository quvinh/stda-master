<template>
  <BasicModal
    style="top: 50px"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useMessage } from '@/hooks/web/useMessage';
  import { createMoldApi, updateMoldApi } from '@/api/sys/mold';
  import { IMold } from '@/api/model/IMold';
  import AttributeResource from '@/api/resource/AttributeResource';
  import IAttribute from '@/api/model/IAttribute';

  const emit = defineEmits(['success']);
  const { createMessage: msg } = useMessage();
  const record = ref<IMold>();
  const isUpdate = ref<boolean>(true);

  let defaultSchema: FormSchema[] = [
    {
      field: 'id',
      label: 'Mã khuôn',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
    {
      field: 'name',
      label: 'Tên khuôn',
      component: 'Input',
      required: true,
      rules: [{ max: 200 }],
      colProps: { span: 12 },
    },
  ];

  let getFormSchema: FormSchema[] = [...defaultSchema];

  const [registerForm, { setFieldsValue, resetFields, validate, updateSchema, resetSchema }] =
    useForm({
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

  // useModalInner để nhận dữ liệu từ view cha
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;

    // Gọi hàm fetchAttributesAndUpdateSchema() cho cả tạo mới và sửa
    await fetchAttributesAndUpdateSchema();

    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({ ...data.record });
      updateSchema([{ field: 'id', componentProps: { disabled: true } }]);
    } else {
      // Không cần resetSchema(defaultSchema) vì fetchAttributesAndUpdateSchema đã cập nhật schema đầy đủ
      // resetSchema(defaultSchema);
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  // Hàm submit xử lý validate form và gọi API tương ứng
  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values: any = await validate();
      if (!unref(isUpdate)) {
        const res: any = await createMoldApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else {
          msg.error('Thao tác thất bại');
        }
      } else {
        const res: any = await updateMoldApi({ ...values, id: record.value?.id });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else {
          msg.error('Thao tác thất bại');
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  async function fetchAttributesAndUpdateSchema() {
    try {
      const res = await AttributeResource.getAll<IAttribute>({ model: 'mold' });
      if (res.success) {
        const attrs = res.data.data.filter((attr) => attr.name !== 'id' && attr.name !== 'name');
        const dynamicSchema: FormSchema[] = attrs.map((attr) => {
          let component: string = 'Input';
          if (attr.attribute_type === 'boolean') {
            component = 'Switch';
          } else if (attr.attribute_type === 'integer' || attr.attribute_type === 'decimal') {
            component = 'InputNumber';
          }
          return {
            field: attr.name,
            label: attr.display_name,
            component,
            required: attr.is_required,
            colProps: { span: 12 },
          } as unknown as FormSchema;
        });
        getFormSchema = [...defaultSchema, ...dynamicSchema];
        resetSchema(getFormSchema);
      }
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  }
</script>
