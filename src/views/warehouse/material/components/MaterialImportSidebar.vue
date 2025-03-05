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
      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
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
  import { Button, DatePicker, Form, FormItem, Input } from 'ant-design-vue';
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

  const formRef = ref();
  const formData = reactive<any>({
    material_receipt_id: props.filter.material_receipt_id,
    receipt_date: props.filter.receipt_date,
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

  function handleSubmit() {
    const form = unref(formRef);
    emit('success', form.getFieldsValue());
  }
</script>
