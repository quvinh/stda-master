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
        <Divider style="margin: 4px 0; font-size: 14px">Điều kiện truy vấn</Divider>

        <FormItem label="Số PO" name="po_number">
          <Input :allowClear="true" v-model:value="formData.po_number" placeholder="Số PO" />
        </FormItem>

        <FormItem label="Mã sản phẩm" name="product_id">
          <Select
            :allowClear="true"
            :options="productOptions"
            :value="selectedProduct"
            optionFilterProp="label"
            showSearch
            @change="handleSelectedProductChange"
          />
        </FormItem>

        <FormItem label="Mã khách hàng" name="customer_id">
          <Select
            :allowClear="true"
            :options="customerOptions"
            :value="selectedCustomer"
            optionFilterProp="label"
            showSearch
            @change="handleSelectedCustomerChange"
          />
        </FormItem>

        <FormItem label="Ngày nhận đơn" name="order_date">
          <DatePicker class="w-full" v-model:value="formData.order_date" format="DD/MM/YYYY" />
        </FormItem>

        <FormItem label="Ngày giao hàng" name="delivery_date">
          <DatePicker class="w-full" v-model:value="formData.delivery_date" format="DD/MM/YYYY" />
        </FormItem>
      </div>
    </div>

    <div
      class="sticky bottom-0 left-0 right-0 bg-white pt-1 border-t border-gray-300 section-button"
    >
      <FormItem class="text-center mb-1 p-0">
        <Button block type="primary" size="large" htmlType="submit" class="m-0">
          <Icon icon="ant-design:search-outlined" />
          Tìm kiếm
        </Button>
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { Button, Form, FormItem, Input, Select, Divider, DatePicker } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { onUnmounted, onMounted, unref, ref, reactive } from 'vue';
  import { DefaultOptionType, SelectValue } from 'ant-design-vue/lib/select';
  import ProductResource from '@/api/resource/ProductResource';
  import { IProduct } from '@/api/model/IProduct';
  import CustomerResource from '@/api/resource/CustomerResource';
  import { ICustomer } from '@/api/model/ICustomer';

  const emit = defineEmits(['success']);
  // const props = defineProps({
  //   filter: {
  //     type: Object as PropType<{
  //       dates?: Dayjs[];
  //       batch_id?: string;
  //       lot_id?: string;
  //       process_ids?: string[];
  //       equipment_ids?: string[];
  //     }>,
  //     default: () => ({
  //       dates: [dayjs(), dayjs()],
  //       batch_id: '',
  //       lot_id: '',
  //       process_ids: [],
  //       equipment_ids: [],
  //     }),
  //   },
  // });

  const formRef = ref();
  const formData = reactive<any>({
    // dates: props.filter.dates,
    // batch_id: props.filter.batch_id,
    po_number: null,
    order_date: null,
    delivery_date: null,
  });
  const customerOptions = ref<any>([{ label: 'Tất cả', value: '' }]);
  const selectedCustomer = ref('');
  const selectedProduct = ref('');
  const productOptions = ref<any>([{ label: 'Tất cả', value: '' }]);
  // const filterType = ref<'day' | 'week' | 'month'>('day');

  // function setFilterType(type) {
  //   filterType.value = type;
  // }

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    const customerResponse = await CustomerResource.getAll<ICustomer>();
    if (customerResponse?.success) {
      const options = [{ label: 'Tất cả', value: '' }];
      customerResponse.data.data.forEach((customer: any) => {
        options.push({ label: customer.customer_name, value: customer.id });
      });
      customerOptions.value = options;
    }

    const productResponse = await ProductResource.getAll<IProduct>();
    if (productResponse?.data) {
      const options = [{ label: 'Tất cả', value: '' }];
      productResponse.data.data.forEach((product: any) => {
        options.push({ label: product.id, value: product.id });
      });
      productOptions.value = options;
    }
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });

  function handleSelectedCustomerChange(
    value: SelectValue,
    _option: DefaultOptionType | DefaultOptionType[],
  ) {
    selectedCustomer.value = value as string; // Explicitly cast to string
    formData.customer_id = value as string;
  }

  function handleSelectedProductChange(
    value: SelectValue,
    _option: DefaultOptionType | DefaultOptionType[],
  ) {
    selectedProduct.value = value as string;
    formData.product_id = value as string;
  }

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
    // data = cleanAndFormatData(data, filterType.value);
    const data = unref(formRef).getFieldsValue();
    if (data?.order_date) {
      data.order_date = dayjs(data.order_date).format('YYYY-MM-DD');
    }
    if (data?.delivery_date) {
      data.delivery_date = dayjs(data.delivery_date).format('YYYY-MM-DD');
    }
    emit('success', data);
  }
</script>

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 6px !important;
  }

  .filter-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
  }

  .filter-buttons .ant-btn {
    flex: 1;
  }

  .full-width {
    width: 100%;
    margin-bottom: 4px;
  }

  .button {
    font-size: 13px;
  }
</style>
