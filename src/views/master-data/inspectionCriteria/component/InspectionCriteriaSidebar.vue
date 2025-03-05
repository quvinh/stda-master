<template>
  <Form
    ref="formRef"
    :model="formData"
    @keypress.enter="handleSubmit"
    @submit="handleSubmit"
    class="bg-white pl-2 pr-2 flex flex-col h-full section-form border-1 border-gray-300"
    layout="vertical"
  >
    <div class="flex-1 flex flex-col h-full pt-5">
      <FormItem label="Tên chỉ tiêu" name="name">
        <Input v-model:value="formData.name" placeholder="Vui lòng nhập" allowClear />
      </FormItem>

      <FormItem label="Mô tả" name="description">
        <Input v-model:value="formData.description" placeholder="Vui lòng nhập" allowClear />
      </FormItem>

      <FormItem label="Loại chỉ tiêu" name="inspection_criterion_category_id">
        <Select
          v-model:value="formData.inspection_criterion_category_id"
          :options="inspectionCriterionCategoryOptions"
          allowClear
          optionFilterProp="label"
          showSearch
        />
      </FormItem>
      <FormItem label="Sản phẩm" name="product_id">
        <Select
          v-model:value="formData.product_id"
          :options="productOptions"
          allowClear
          optionFilterProp="label"
          showSearch
        />
      </FormItem>

      <FormItem label="Quy trình" name="process_id">
        <Select
          v-model:value="formData.process_id"
          :options="processesOptions"
          allowClear
          optionFilterProp="label"
          showSearch
        />
      </FormItem>

      <FormItem label="Nguyên vật liệu" name="material_id">
        <Select
          v-model:value="formData.material_id"
          :options="materialsOptions"
          allowClear
          optionFilterProp="label"
          showSearch
        />
      </FormItem>
    </div>

    <div
      class="sticky bottom-0 left-0 right-0 bg-white pt-1 border-t border-gray-300 section-button"
    >
      <FormItem class="text-center mb-1 p-0">
        <Button block type="primary" size="large" htmlType="submit" class="m-0">
          <Icon icon="ant-design:search-outlined" /> Tìm kiếm
        </Button>
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
  import InspectionCriterionCategoryResource from '@/api/resource/InspectionCriterionCategoryResource';
  import MaterialResource from '@/api/resource/MaterialResource';
  import ProcessResource from '@/api/resource/ProcessResource';
  import ProductResource from '@/api/resource/ProductResource';
  import Icon from '@/components/Icon/Icon.vue';
  import { ISelectOption } from '@/store/types/pagination';
  import { Button, Form, FormItem, Input, Select } from 'ant-design-vue';
  import { onUnmounted, onMounted, unref, ref, reactive } from 'vue';

  const emit = defineEmits(['success']);

  interface FilterProps {
    name?: string;
    inspection_criterion_category_id?: string;
    description?: string;
    input_type?: string;
    evaluation_method?: string;
    product_id?: string;
    process_id?: string;
    material_id?: string;
  }

  const formRef = ref();
  const formData = reactive<FilterProps>({});

  const inspectionCriterionCategoryOptions = ref<ISelectOption[]>([]);
  const productOptions = ref<ISelectOption[]>([]);
  const materialsOptions = ref<ISelectOption[]>([]);
  const processesOptions = ref<ISelectOption[]>([]);

  const fetchOptions = async () => {
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
      materialsOptions.value = materialsResponse.value;
    }

    if (processesResponse.status === 'fulfilled') {
      processesOptions.value = processesResponse.value;
    }
  };

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    fetchOptions();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });

  async function updateHeight() {
    const sectionForm: any = document.querySelector('.section-form');
    if (sectionForm) {
      const menuHeight = 50;
      const tabHeight = 30;
      const sectionButton: any = sectionForm.querySelector('.section-button');
      const result =
        window.innerHeight -
        menuHeight -
        tabHeight -
        Number(sectionButton.offsetHeight || 0) -
        200 -
        15;
      if (result) {
        sectionForm
          .querySelector('.section-search-input')
          ?.style.setProperty('max-height', `${result}px`, 'important');
      }
    }
  }

  function handleSubmit() {
    const form = unref(formRef);
    emit('success', form.getFieldsValue());
  }
</script>

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 6px !important;
  }
</style>
