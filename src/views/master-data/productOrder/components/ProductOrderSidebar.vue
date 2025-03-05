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
      <FormItem label="Mã đơn hàng" name="id">
        <Input v-model:value="formData.id" placeholder="Vui lòng nhập" />
      </FormItem>

      <FormItem label="Mã sản phẩm" name="product_id">
        <AutoComplete
          v-model:value="formData.product_id"
          :dataSource="productOptions"
          @search="handleSearchProduct"
          placeholder="Vui lòng nhập"
          allowClear
        />
      </FormItem>

      <!-- <FormItem label="Mã máy" name="equipment_id">
        <Select
          :options="equipments"
          placeholder="Vui lòng chọn"
          v-model:value="formData.equipment_id"
        />
      </FormItem> -->

      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <FormItem label="Thời gian" name="dates">
          <RangePicker v-model:value="formData.dates" />
        </FormItem>
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
  import { searchProductApi } from '@/api/sys/product';
  import Icon from '@/components/Icon/Icon.vue';
  import { AutoComplete, Button, Form, FormItem, Input, RangePicker } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { onUnmounted, onMounted, unref, ref, reactive } from 'vue';

  const emit = defineEmits(['success']);

  const formRef = ref();
  const formData = reactive<any>({
    id: null,
    product_id: null,
    dates: null,
  });
  const timer = ref<any>();
  const productOptions = ref<{ value: string; text: string }[]>([]);

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);

    handleSearchProduct();
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
    const payload: any = form.getFieldsValue();
    if (payload?.dates) {
      payload.start_time = dayjs(payload.dates[0]).format('YYYY-MM-DD');
      payload.end_time = dayjs(payload.dates[1]).format('YYYY-MM-DD');
      delete payload.dates;
    }
    emit('success', payload);
  }

  function handleSearchProduct(value = '') {
    clearTimeout(timer.value);
    timer.value = setTimeout(async () => {
      const res: any = await searchProductApi({
        id: value,
        page: 1,
        pageSize: 10,
      });
      if (res?.data) {
        productOptions.value = res.data?.map(({ id }) => ({ value: id, text: id }));
      }
    }, 500);
  }
</script>

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 6px !important;
  }
</style>
