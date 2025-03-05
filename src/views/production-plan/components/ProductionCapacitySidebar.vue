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
          :options="products"
          placeholder="Vui lòng chọn"
          v-model:value="formData.product_id"
        />
      </FormItem>

      <FormItem label="Mã công đoạn" name="process_id">
        <Select
          :options="process"
          placeholder="Vui lòng chọn"
          v-model:value="formData.process_id"
        />
      </FormItem>

      <FormItem label="Mã máy" name="equipment_id">
        <Select
          :options="equipments"
          placeholder="Vui lòng chọn"
          v-model:value="formData.equipment_id"
        />
      </FormItem>

      <!-- <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <FormItem label="Thời gian" name="dates">
          <RangePicker v-model:value="formData.dates" />
        </FormItem>
      </div> -->
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
  import { useEquipmentStore } from '@/store/modules/states/equipment';
  import { useProcessStore } from '@/store/modules/states/process';
  import { useProductStore } from '@/store/modules/states/product';
  import { Button, Form, FormItem, message, Select } from 'ant-design-vue';
  import { onUnmounted, onMounted, unref, ref, reactive } from 'vue';

  const emit = defineEmits(['success']);

  const formRef = ref();
  const loading = ref<boolean>(false);
  const productStore = useProductStore();
  const processStore = useProcessStore();
  const equipmentStore = useEquipmentStore();
  const products = ref<{ label: string; value: string }[]>([]);
  const equipments = ref<{ label: string; value: string }[]>([]);
  const process = ref<{ label: string; value: string }[]>([]);
  const formData = reactive<any>({
    product_id: '',
    process_id: '',
    equipment_id: '',
  });

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    fetchProcess();
    fetchEquipment();
    fetchProduct();
  });

  async function fetchProduct(param: any = {}) {
    try {
      loading.value = true;
      const response = await productStore.search(param);
      // Set data
      const productData = response.data ?? [];
      products.value = productData.map((i) => ({
        label: i.product_name,
        value: i.id,
      }));
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function fetchProcess(param: any = {}) {
    try {
      loading.value = true;
      const response = await processStore.search(param);
      // Set data
      const processData = response.data ?? [];
      process.value = processData.map((i) => ({
        label: i.name,
        value: i.id,
      }));
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function fetchEquipment(param: any = {}) {
    try {
      loading.value = true;
      const response = await equipmentStore.search(param);
      // Set data
      const equipmentData = response.data ?? [];
      equipments.value = equipmentData.map((i) => ({
        label: i.equipment_name,
        value: i.id,
      }));
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

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

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 6px !important;
  }
</style>
