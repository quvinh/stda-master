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
      <!--  -->

      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <FormItem label="Thời gian" name="dates">
          <RangePicker v-model:value="formData.dates"
        /></FormItem>
        <FormItem label="Máy" name="mold_id"><Input placeholder="Vui lòng nhập" /></FormItem>

        <!-- Add here -->
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
  import { Button, Form, FormItem, Input, RangePicker } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { unref, ref, PropType, reactive } from 'vue';

  const emit = defineEmits(['success']);
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        process?: string[];
        dates?: Dayjs[];
        mold_id?: string;
        location?: string;
      }>,
      default: () => ({
        process: [],
        dates: [dayjs(), dayjs()],
        mold_id: '',
        location: '',
      }),
    },
  });

  const formRef = ref();
  const formData = reactive<any>({
    process: props.filter.process || [],
    dates: props.filter.dates,
    mold_id: props.filter.mold_id,
    location: props.filter.location,
  });
  function handleSubmit() {
    const form = unref(formRef);
    emit('success', form.getFieldsValue());
  }
</script>
