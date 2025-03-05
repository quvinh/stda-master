<template>
  <Form
    ref="formRef"
    :model="formData"
    @keypress.enter="handleSubmit"
    @submit="handleSubmit"
    class="bg-white pl-2 pr-2 flex flex-col h-full section-form border-1 border-gray-300"
    layout="vertical"
  >
    <div class="flex-1 flex flex-col h-[calc(100%-60px)]">
      <Divider style="margin: 4px 0; font-size: 14px">Điều kiện truy vấn </Divider>
      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <FormItem label="Người nhập" name="created_by">
          <Input
            placeholder="Tên người nhập"
            v-model:value="formData.created_by"
            :allowClear="true"
        /></FormItem>
        <FormItem label="Mã phiếu nhập" name="material_receipt_id">
          <Input
            placeholder="Mã phiếu nhập"
            v-model:value="formData.material_receipt_id"
            :allowClear="true"
        /></FormItem>
        <FormItem label="Ngày nhập" name="receipt_date">
          <DatePicker
            placeholder="Ngày nhập"
            class="w-100%"
            v-model:value="formData.receipt_date"
            :allowClear="true"
        /></FormItem>
        <FormItem label="Chọn loại" name="type">
          <Select
            placeholder="Chọn loại"
            :options="option"
            class="w-100%"
            v-model:value="formData.type"
            :allowClear="true"
            @change="handleChangeType"
        /></FormItem>
      </div>
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
  import Icon from '@/components/Icon/Icon.vue';
  import { Button, DatePicker, Form, FormItem, Input, Select, Divider } from 'ant-design-vue';
  import { Dayjs } from 'dayjs';
  import { onUnmounted, unref, ref, PropType, reactive, onMounted } from 'vue';

  const emit = defineEmits(['success']);
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        material_receipt_id?: string;
        receipt_date?: Dayjs;
      }>,
      default: () => ({
        material_receipt_id: null,
        receipt_date: null,
      }),
    },
  });

  const option = ref([
    { value: 1, label: 'Nguyên vật liệu' },
    { value: 2, label: 'Thành phẩm' },
  ]);

  const formRef = ref();
  const formData = reactive<any>({
    material_receipt_id: props.filter.material_receipt_id,
    receipt_date: props.filter.receipt_date,
    type: 1,
    created_by: undefined,
    canFetch: false,
  });

  onMounted(() => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
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
      console.log('height =', result);
      if (result) {
        sectionForm
          .querySelector('.section-search-input')
          ?.style.setProperty('max-height', `${result}px`, 'important');
      }
    }
  }

  function handleChangeType(value) {
    formData.type = value;
    formData.canFetch = false;
    const form = unref(formRef);
    console.log(form.getFieldsValue());
    emit('success', form.getFieldsValue());
  }

  function handleSubmit() {
    formData.canFetch = true;
    const form = unref(formRef);
    console.log(form.getFieldsValue());
    emit('success', form.getFieldsValue());
  }
</script>
