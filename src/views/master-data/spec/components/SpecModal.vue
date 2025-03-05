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

<script setup lang="ts">
  import { ref, computed, unref } from 'vue';
  import ISpec from '@/api/model/ISpec';
  import { createSpecApi, updateSpecApi } from '@/api/sys/spec';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import AttributeResource from '@/api/resource/AttributeResource';
  import IAttribute from '@/api/model/IAttribute';
  import { ISelectOption } from '@/store/types/pagination';
  import ProductResource from '@/api/resource/ProductResource';
  import ProcessResource from '@/api/resource/ProcessResource';
  import EquipmentResouce from '@/api/resource/EquipmentResouce';

  const emit = defineEmits(['success']);
  const { createMessage: msg } = useMessage();

  const record = ref<ISpec>();
  const isUpdate = ref<boolean>(true);
  const loading = ref<boolean>(false);

  // Định nghĩa các biến options dưới dạng reactive
  const productOptions = ref<ISelectOption[]>([]);
  const processOptions = ref<ISelectOption[]>([]);
  const equipmentOptions = ref<ISelectOption[]>([]);

  // Schema ban đầu dùng tên trường: product_id, process_id, equipment_id
  const defaultSchema: FormSchema[] = [
    {
      field: 'product_id',
      label: 'Mã sản phẩm',
      component: 'Select',
      required: true,
      colProps: { span: 12 },
      // Không gán trực tiếp giá trị lúc khởi tạo,
      // ta sẽ cập nhật lại sau khi fetch
      componentProps: { options: [] },
    },
    {
      field: 'process_id',
      label: 'Mã công đoạn',
      component: 'Select',
      colProps: { span: 12 },
      componentProps: { options: [] },
    },
    {
      field: 'equipment_id',
      label: 'Mã máy',
      component: 'Select',
      colProps: { span: 12 },
      componentProps: { options: [] },
    },
  ];

  let getFormSchema: FormSchema[] = [...defaultSchema];

  const [registerForm, { setFieldsValue, resetFields, validate, resetSchema }] = useForm({
    labelWidth: 120,
    layout: 'vertical',
    baseColProps: { span: 24 },
    rowProps: { gutter: 10 },
    schemas: getFormSchema,
    showActionButtonGroup: false,
    actionColOptions: { span: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    // Reset form và schema trước khi mở modal
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;

    // Fetch các options từ API
    await fetchOptions();
    await fetchAttributesAndUpdateSchema();

    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue(data.record);
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  // Tiêu đề modal dựa trên isUpdate
  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  // Hàm fetch options và cập nhật lại schema cho các trường select
  async function fetchOptions() {
    loading.value = true;
    try {
      const [productResponse, processResponse, equipmentResponse] = await Promise.allSettled([
        ProductResource.getOptions(),
        ProcessResource.getOptions(),
        EquipmentResouce.getOptions(),
      ]);

      if (productResponse.status === 'fulfilled') {
        productOptions.value = productResponse.value;
      }
      if (processResponse.status === 'fulfilled') {
        processOptions.value = processResponse.value;
      }
      if (equipmentResponse.status === 'fulfilled') {
        equipmentOptions.value = equipmentResponse.value;
      }

      // Cập nhật lại các options trong schema và reset schema cho form
      defaultSchema.forEach((item) => {
        if (item.field === 'product_id') {
          item.componentProps.options = productOptions.value;
        }
        if (item.field === 'process_id') {
          item.componentProps.options = processOptions.value;
        }
        if (item.field === 'equipment_id') {
          item.componentProps.options = equipmentOptions.value;
        }
      });
      resetSchema([...defaultSchema]);
    } catch (error: any) {
      msg.error(error.message);
    } finally {
      loading.value = false;
    }
  }

  // Hàm fetch attributes và cập nhật schema động
  async function fetchAttributesAndUpdateSchema() {
    try {
      const res = await AttributeResource.getAll<IAttribute>({ model: 'spec_instance' });
      if (res.success) {
        const skipFields = ['process_id', 'equipment_id', 'product_id'];
        const attrs = res.data.data.filter((attr) => !skipFields.includes(attr.name));
        const dynamicSchema: FormSchema[] = attrs.map((attr) => {
          let component = 'Input';
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
          } as FormSchema;
        });
        getFormSchema = [...defaultSchema, ...dynamicSchema];
        resetSchema(getFormSchema);
      }
    } catch (error) {
      console.error('Error fetching dynamic attributes:', error);
    }
  }

  // Hàm xử lý submit form
  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values: any = await validate();
      if (!unref(isUpdate)) {
        const res: any = await createSpecApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else {
          msg.error('Thao tác thất bại');
        }
      } else {
        const res: any = await updateSpecApi({ ...values, id: record.value?.id ?? null });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else {
          msg.error('Thao tác thất bại');
        }
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>
