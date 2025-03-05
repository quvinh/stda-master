<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <a-tabs>
      <a-tab-pane key="1" tab="Thông tin chung">
        <BasicForm @register="registerGeneralForm" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Đối tượng áp dụng">
        <BasicForm @register="registerTargetForm" />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { IInspectionCriteria } from '@/api/model/IInspectionCriteria';
  import {
    createInspectionCriteriaApi,
    updateInspectionCriteriaApi,
  } from '@/api/sys/inspection-criteria';
  import { FormSchema } from '@/components/Form';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { computed, ref, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import ProcessResource from '@/api/resource/ProcessResource';
  import ProductResource from '@/api/resource/ProductResource';
  import MaterialResource from '@/api/resource/MaterialResource';
  import InspectionCriterionCategoryResource from '@/api/resource/InspectionCriterionCategoryResource';
  import { ISelectOption } from '@/store/types/pagination';

  const emit = defineEmits(['success']);
  const { createMessage: msg } = useMessage();
  const record = ref<IInspectionCriteria>();
  const isUpdate = ref<boolean>(true);
  const processOptions = ref<ISelectOption[]>([]);
  const productOptions = ref<ISelectOption[]>([]);
  const materialOptions = ref<ISelectOption[]>([]);
  const inspectionCriterionCategoryOptions = ref<ISelectOption[]>([]);
  const generalFormSchema: FormSchema[] = [
    {
      field: 'inspection_criterion_category_id',
      label: 'Loại chỉ tiêu',
      component: 'Select',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        options: inspectionCriterionCategoryOptions.value,
        showSearch: true,
        optionFilterProp: 'label',
      },
    },
    {
      field: 'name',
      label: 'Tên chỉ tiêu',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'input_type',
      label: 'Kiểu nhập',
      component: 'Select',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: 'Pass/Fail', value: 'pass_fail' },
          { label: 'Văn bản', value: 'text' },
          { label: 'Số', value: 'number' },
        ],
        allowClear: false,
      },
    },
    {
      field: 'evaluation_method',
      label: 'Phương pháp đánh giá',
      component: 'Select',
      required: true,
      colProps: { span: 12 },
      componentProps: {
        options: [
          { label: 'Không đánh giá', value: 'none' },
          { label: 'So sánh cận trên/dưới', value: 'compare_with_range' },
          { label: 'Pass/Fail', value: 'pass_fail' },
        ],
        allowClear: false,
      },
    },
    {
      field: 'lower_limit',
      label: 'Cận dưới',
      component: 'InputNumber',
      colProps: { span: 12 },
      componentProps: { min: 0 },
    },
    {
      field: 'upper_limit',
      label: 'Cận trên',
      component: 'InputNumber',
      colProps: { span: 12 },
      componentProps: { min: 0 },
    },
    {
      field: 'description',
      label: 'Mô tả',
      component: 'Input',
      colProps: { span: 24 },
    },
  ];
  const targetFormSchema: FormSchema[] = [
    {
      field: 'process_ids',
      label: 'Công đoạn',
      component: 'Select',
      colProps: { span: 24 },
      componentProps: {
        options: processOptions.value,
        mode: 'multiple',
        showSearch: true,
        optionFilterProp: 'label',
      },
    },
    {
      field: 'product_ids',
      label: 'Sản phẩm',
      component: 'Select',
      colProps: { span: 24 },
      componentProps: {
        options: productOptions.value,
        mode: 'multiple',
        showSearch: true,
        optionFilterProp: 'label',
      },
    },
    {
      field: 'material_ids',
      label: 'Nguyên vật liệu',
      component: 'Select',
      colProps: { span: 24 },
      componentProps: {
        options: materialOptions.value,
        mode: 'multiple',
        showSearch: true,
        optionFilterProp: 'label',
      },
    },
  ];
  const [
    registerGeneralForm,
    {
      setFieldsValue: setGeneralFieldsValue,
      resetFields: resetGeneralFields,
      validate: validateGeneral,
      updateSchema: updateGeneralSchema,
    },
  ] = useForm({
    labelWidth: 180,
    layout: 'vertical',
    baseColProps: { span: 24 },
    rowProps: { gutter: 10 },
    schemas: generalFormSchema,
    showActionButtonGroup: false,
    actionColOptions: { span: 24 },
  });
  const [
    registerTargetForm,
    {
      setFieldsValue: setTargetFieldsValue,
      resetFields: resetTargetFields,
      validate: validateTarget,
      updateSchema: updateTargetSchema,
    },
  ] = useForm({
    labelWidth: 150,
    layout: 'vertical',
    baseColProps: { span: 24 },
    rowProps: { gutter: 10 },
    schemas: targetFormSchema,
    showActionButtonGroup: false,
    actionColOptions: { span: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await fetchOptions();
    resetGeneralFields();
    resetTargetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      const targets = data.record?.inspection_criterion_targets || [];
      const processIds = targets
        .filter((t) => t.target_type === 'App\\Models\\Process')
        .map((t) => t.target_id);
      const productIds = targets
        .filter((t) => t.target_type === 'App\\Models\\Product')
        .map((t) => t.target_id);
      const materialIds = targets
        .filter((t) => t.target_type === 'App\\Models\\Material')
        .map((t) => t.target_id);
      setGeneralFieldsValue({ ...data.record });
      setTargetFieldsValue({
        process_ids: processIds,
        product_ids: productIds,
        material_ids: materialIds,
      });
    }
    setModalProps({ loading: false, confirmLoading: false });
  });
  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));
  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const generalValues = await validateGeneral();
      const targetValues = await validateTarget();
      const values: any = { ...generalValues, ...targetValues };
      if (!unref(isUpdate)) {
        const res: any = await createInspectionCriteriaApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        const res: any = await updateInspectionCriteriaApi({
          ...values,
          id: record.value?.id ?? null,
        });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else msg.error('Thao tác thất bại');
      }
    } catch (error: any) {
      message.error(error.message);
    }
    setModalProps({ loading: false, confirmLoading: false });
  }
  async function fetchOptions() {
    try {
      const [
        inspectionCriterionCategoryResponse,
        productResponse,
        materialsResponse,
        processesResponse,
      ] = await Promise.allSettled([
        InspectionCriterionCategoryResource.getOptions(),
        ProductResource.getOptions(),
        MaterialResource.getOptions(),
        ProcessResource.getOptions(),
      ]);
      if (inspectionCriterionCategoryResponse.status === 'fulfilled') {
        inspectionCriterionCategoryOptions.value = inspectionCriterionCategoryResponse.value;
      }
      if (productResponse.status === 'fulfilled') {
        productOptions.value = productResponse.value;
      }
      if (materialsResponse.status === 'fulfilled') {
        materialOptions.value = materialsResponse.value;
      }
      if (processesResponse.status === 'fulfilled') {
        processOptions.value = processesResponse.value;
      }
      updateTargetSchema([
        { field: 'process_ids', componentProps: { options: processOptions.value } },
        { field: 'product_ids', componentProps: { options: productOptions.value } },
        { field: 'material_ids', componentProps: { options: materialOptions.value } },
      ]);
      updateGeneralSchema([
        {
          field: 'inspection_criterion_category_id',
          componentProps: { options: inspectionCriterionCategoryOptions.value },
        },
      ]);
    } catch (error: any) {
      msg.error(error.message);
    }
  }
</script>
