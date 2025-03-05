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
      <FormItem label="Mã bom" name="id">
        <Input v-model:value="formData.id" placeholder="Vui lòng nhập" allowClear />
      </FormItem>

      <FormItem label="Mã sản phẩm" name="product_id">
        <Select
          v-model:value="formData.product_id"
          placeholder="Vui lòng chọn"
          allowClear
          showSearch
          :options="productOptions"
        />
      </FormItem>

      <FormItem label="Mô tả" name="description">
        <Input.TextArea
          v-model:value="formData.description"
          placeholder="Vui lòng nhập"
          allowClear
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
  import ProductResource from '@/api/resource/ProductResource';
  import Icon from '@/components/Icon/Icon.vue';
  import { ISelectOption } from '@/store/types/pagination';
  import { Button, Form, FormItem, Input, Select } from 'ant-design-vue';
  import { onUnmounted, onMounted, unref, ref, reactive } from 'vue';

  const emit = defineEmits(['success']);

  const formRef = ref();
  interface FormProps {
    id?: string;
    product_id?: string;
    description?: string;
  }
  const formData = reactive<FormProps>({});
  const productOptions = ref<ISelectOption[]>([]);

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });

  ProductResource.getOptions().then((res) => {
    productOptions.value = res;
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
    emit('success', form.getFieldsValue());
  }
</script>

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 6px !important;
  }
</style>
