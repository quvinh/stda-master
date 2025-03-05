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
      <FormItem label="Mã khuôn" name="id">
        <Input v-model:value="formData.id" placeholder="Vui lòng nhập" />
      </FormItem>
      <FormItem label="Tên khuôn" name="name">
        <Input v-model:value="formData.name" placeholder="Vui lòng nhập" />
      </FormItem>

      <FormItem
        v-for="attr in attributes"
        :key="attr.id"
        :label="attr.display_name"
        :name="attr.name"
      >
        <template v-if="attr.attribute_type === 'boolean'">
          <Switch v-model:checked="formData[attr.name]" />
        </template>
        <template
          v-else-if="attr.attribute_type === 'integer' || attr.attribute_type === 'decimal'"
        >
          <!-- Sử dụng InputNumber cho các kiểu số -->
          <InputNumber v-model:value="formData[attr.name]" placeholder="Vui lòng nhập" />
        </template>
        <template v-else>
          <Input v-model:value="formData[attr.name]" placeholder="Vui lòng nhập" />
        </template>
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
  import IAttribute from '@/api/model/IAttribute';
  import AttributeResource from '@/api/resource/AttributeResource';
  import Icon from '@/components/Icon/Icon.vue';
  import { Button, Form, FormItem, Input, Switch, InputNumber } from 'ant-design-vue';
  import { onUnmounted, onMounted, unref, ref, reactive } from 'vue';

  const emit = defineEmits(['success']);

  const attributes = ref<IAttribute[]>([]);

  const formData = reactive<Record<string, any>>({
    id: null,
    name: null,
  });

  const formRef = ref();

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    await updateAttributes();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });

  const updateAttributes = async () => {
    try {
      const res = await AttributeResource.getAll<IAttribute>({ model: 'mold' });
      if (res.success) {
        attributes.value = res.data.data.filter(
          (attr) => attr.name !== 'id' && attr.name !== 'name',
        );
        attributes.value.forEach((attr) => {
          formData[attr.name] =
            attr.default_value ||
            (attr.attribute_type === 'boolean'
              ? false
              : attr.attribute_type === 'integer' || attr.attribute_type === 'decimal'
                ? null
                : '');
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

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
