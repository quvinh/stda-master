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
      <FormItem label="Mã sản phẩm" name="product_id">
        <Select
          :options="productOptions"
          placeholder="Vui lòng chọn"
          v-model:value="formData.product_id"
          :show-search="true"
          :filter-option="filterOption"
          :allowClear="true"
          :field-names="{ label: 'label', value: 'value' }"
        />
      </FormItem>

      <FormItem label="Mã công đoạn" name="process_id">
        <Select
          :options="processOptions"
          placeholder="Vui lòng chọn"
          v-model:value="formData.process_id"
          :show-search="true"
          :filter-option="filterOption"
          :allowClear="true"
          :field-names="{ label: 'label', value: 'value' }"
        />
      </FormItem>

      <FormItem label="Mã máy" name="equipment_id">
        <Select
          :options="equipmentOptions"
          placeholder="Vui lòng chọn"
          v-model:value="formData.equipment_id"
          :show-search="true"
          :filter-option="filterOption"
          :allowClear="true"
          :field-names="{ label: 'label', value: 'value' }"
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
  import EquipmentResouce from '@/api/resource/EquipmentResouce';
  import ProcessResource from '@/api/resource/ProcessResource';
  import ProductResource from '@/api/resource/ProductResource';
  import Icon from '@/components/Icon/Icon.vue';
  import { ISelectOption } from '@/store/types/pagination';
  import { Button, Form, FormItem, Select } from 'ant-design-vue';
  import { onUnmounted, onMounted, unref, ref, reactive } from 'vue';

  const emit = defineEmits(['success']);

  const formRef = ref();

  interface FormDataType {
    product_id: string | undefined;
    process_id: string | undefined;
    equipment_id: string | undefined;
  }

  const productOptions = ref<ISelectOption[]>([]);
  const processOptions = ref<ISelectOption[]>([]);
  const equipmentOptions = ref<ISelectOption[]>([]);

  const formData = reactive<FormDataType>({
    product_id: undefined,
    process_id: undefined,
    equipment_id: undefined,
  });

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    fetchOptions();
  });

  const fetchOptions = async () => {
    const [productResponse, processesResponse, equipmentResponse] = await Promise.allSettled([
      ProductResource.getOptions(),
      ProcessResource.getOptions(),
      EquipmentResouce.getOptions(),
    ]);

    if (processesResponse.status === 'fulfilled') {
      processOptions.value = processesResponse.value;
    }

    if (productResponse.status === 'fulfilled') {
      productOptions.value = productResponse.value;
    }

    if (equipmentResponse.status === 'fulfilled') {
      equipmentOptions.value = equipmentResponse.value;
    }
  };

  const filterOption = (input, option) => {
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

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
      console.log('height =', result);
      if (result) {
        sectionForm
          .querySelector('.section-search-input')
          ?.style.setProperty('max-height', `${result}px`, 'important');
      }
    }
  }

  function handleSubmit() {
    const form = unref(formRef);
    console.log(form.getFieldsValue());
    emit('success', form.getFieldsValue());
  }
</script>

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 6px !important;
  }
</style>
