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
      <Divider style="margin: 4px 0; font-size: 14px">Điều kiện truy vấn</Divider>
      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <!-- <FormItem label="Người xuất" name="created_by">
          <Input v-model:value="formData.created_by" placeholder="Người xuất" :allowClear="true"
        /></FormItem> -->
        <FormItem label="Mã phiếu xuất" name="id">
          <Input v-model:value="formData.id" placeholder="Mã phiếu xuất" :allowClear="true"
        /></FormItem>
        <FormItem label="Ngày xuất" name="export_date">
          <DatePicker
            v-model:value="formData.export_date"
            class="w-100%"
            placeholder="Ngày xuất"
            :allowClear="true"
        /></FormItem>
        <FormItem label="Chọn loại" name="type">
          <Select
            placeholder="Chọn loại"
            :options="option"
            class="w-100%"
            v-model:value="formData.type"
            :allowClear="true"
        /></FormItem>
      </div>
    </div>

    <div
      class="sticky bottom-0 left-0 right-0 bg-white pt-1 border-t border-gray-300 section-button"
    >
      <FormItem class="text-center mb-1 p-0">
        <Button block type="primary" size="large" htmlType="submit" class="m-0">
          <Icon icon="ant-design:search-outlined" /> Truy vấn
        </Button>
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { Button, DatePicker, Form, FormItem, Input, Select, Divider } from 'ant-design-vue';
  import { onUnmounted, unref, ref, reactive, onMounted } from 'vue';
  import { Dayjs } from 'dayjs';

  const emit = defineEmits(['success']);
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        id?: string;
        export_date?: Dayjs;
      }>,
      default: () => ({
        id: '',
        export_date: null,
      }),
    },
  });

  const option = ref([
    { value: 1, label: 'Nguyên vật liệu' },
    { value: 2, label: 'Thành phẩm' },
  ]);

  const formRef = ref();
  const formData = reactive<any>({
    id: props.filter.id,
    export_date: props.filter.export_date,
    created_by: undefined,
    type: 1,
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
