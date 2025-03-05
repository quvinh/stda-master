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
      <div class="mb-0">
        <Row class="flex flex-col flex-1">
          <Divider style="margin: 4px 0; font-size: 14px">Công đoạn</Divider>
          <FormItem name="process">
            <div class="max-h-50 border border-gray-300 p-0 overflow-auto">
              <Tree
                :treeData="treeData"
                v-model:checked-keys="checkedKeys"
                checkable
                multiple
                :selectable="false"
                @check="onCheck"
              />
            </div>
          </FormItem>
        </Row>
      </div>
      <Divider style="margin: 4px 0; font-size: 14px">Thời gian truy vấn</Divider>
      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <div class="filter-buttons pb-1">
          <Button
            size="small"
            @click="setFilterType('day')"
            :type="filterType === 'day' ? 'primary' : 'default'"
            class="button"
            >Ngày
          </Button>
          <Button
            size="small"
            @click="setFilterType('week')"
            :type="filterType === 'week' ? 'primary' : 'default'"
            class="button"
            >Tuần
          </Button>
          <Button
            size="small"
            @click="setFilterType('month')"
            :type="filterType === 'month' ? 'primary' : 'default'"
            class="button"
            >Tháng
          </Button>
        </div>

        <FormItem v-if="filterType === 'day'" name="dates">
          <RangePicker v-model:value="formData.dates" separator="đến" format="DD-MM-YYYY" />
        </FormItem>

        <FormItem v-if="filterType === 'week'" name="dates">
          <RangePicker
            v-model:value="formData.dates"
            picker="week"
            separator="đến"
            format="WW-YYYY"
          />
        </FormItem>

        <FormItem v-if="filterType === 'month'" name="dates">
          <RangePicker
            v-model:value="formData.dates"
            picker="month"
            separator="đến"
            format="MM-YYYY"
          />
        </FormItem>

        <Divider style="margin: 4px 0; font-size: 14px">Điều kiện truy vấn</Divider>
        <FormItem label="Ngày giao hàng" name="batch_id">
          <DatePicker class="w-full" v-model:value="formData.delivery_date" format="DD/MM/YYYY" />
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

        <FormItem label="Dòng sản phẩm" name="product_category_id">
          <Select
            :allowClear="true"
            :options="productCategoryOptions"
            :value="selectedProductCategory"
            optionFilterProp="label"
            showSearch
            @change="handleSelectedProductCategoryChange"
          />
        </FormItem>

        <FormItem label="Mã lô sản xuất" name="batch_code">
          <Input placeholder="Vui lòng nhập" v-model:value="formData.batch_code" allowClear />
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

        <!-- Thêm các trường ẩn để bao gồm process_ids và equipment_ids -->
        <FormItem name="process_ids" :style="{ display: 'none' }">
          <input v-model="formData.process_ids" />
        </FormItem>
        <FormItem name="equipment_ids" :style="{ display: 'none' }">
          <input v-model="formData.equipment_ids" />
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
  import { useProcessStore } from '@/store/modules/states/process';
  import {
    Button,
    Form,
    FormItem,
    Input,
    Row,
    Select,
    Tree,
    RangePicker,
    Divider,
    DatePicker,
  } from 'ant-design-vue';
  import { DataNode } from 'ant-design-vue/lib/tree';
  import dayjs, { Dayjs } from 'dayjs';
  import { onUnmounted, onMounted, ref, reactive } from 'vue';
  import { DefaultOptionType, SelectValue } from 'ant-design-vue/lib/select';
  import ProductResource from '@/api/resource/ProductResource';
  import { IProduct } from '@/api/model/IProduct';
  import CustomerResource from '@/api/resource/CustomerResource';
  import { ICustomer } from '@/api/model/ICustomer';
  import { cleanAndFormatData } from '@/utils/sidebar';
  import ProductCategoryResource from '@/api/resource/ProductCategoryResource';
  import { IProductCategory } from '@/api/model/IProductCategory';

  const emit = defineEmits(['success']);
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        process?: string[];
        dates?: Dayjs[];
        batch_id?: string;
        lot_id?: string;
      }>,
      default: () => ({
        process: [],
        dates: [],
        batch_id: '',
        lot_id: '',
      }),
    },
  });

  const formRef = ref();
  const formData = reactive<any>({
    dates: props.filter.dates,
    batch_code: props.filter.batch_id,
    order_id: '',
    customer_id: '',
    product_id: '',
    product_category_id: '',
    process_ids: [],
    equipment_ids: [],
    delivery_date: null,
  });
  const treeData = ref<DataNode[]>([]);

  const checkedKeys = ref([]);
  const processStore = useProcessStore();
  const customerOptions = ref<any>([{ label: 'Tất cả', value: '' }]);
  const selectedCustomer = ref('');
  const selectedProduct = ref('');
  const selectedProductCategory = ref('');
  const productOptions = ref<any>([{ label: 'Tất cả', value: '' }]);
  const productCategoryOptions = ref<any>([{ label: 'Tất cả', value: '' }]);
  const nodeTypeMap = new Map<string, 'process' | 'equipment'>();
  const filterType = ref<'day' | 'week' | 'month'>('day');

  function setFilterType(type: 'day' | 'week' | 'month') {
    filterType.value = type;
  }

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    const [response, customerResponse, productResponse, productCategoryResponse] =
      await Promise.all([
        processStore.search(),
        CustomerResource.getAll<ICustomer>(),
        ProductResource.getAll<IProduct>(),
        ProductCategoryResource.getAll<IProductCategory>(),
      ]);

    if (customerResponse?.success) {
      const options = [{ label: 'Tất cả', value: '' }];
      customerResponse.data.data.forEach((customer: any) => {
        options.push({ label: customer.customer_name, value: customer.id });
      });
      customerOptions.value = options;
    }

    if (productResponse?.data) {
      const options = [{ label: 'Tất cả', value: '' }];
      productResponse.data.data.forEach((product: any) => {
        options.push({ label: product.id, value: product.id });
      });
      productOptions.value = options;
    }

    if (productCategoryResponse?.data) {
      const options = [{ label: 'Tất cả', value: '' }];
      productCategoryResponse.data.data.forEach((productCategory: IProductCategory) => {
        options.push({
          label: productCategory.product_category_name,
          value: String(productCategory.id),
        });
      });
      productCategoryOptions.value = options;
    }

    if (response?.data) {
      treeData.value = response.data.map((item: any) => ({
        title: item.name,
        key: item.id,
        children: item.equipments?.map((equipment: any) => ({
          title: equipment.id,
          key: equipment.id,
        })),
      }));
      // Map node types
      response.data.forEach((item: any) => {
        nodeTypeMap.set(item.id, 'process');
        item.equipments?.forEach((equipment: any) => {
          nodeTypeMap.set(equipment.id, 'equipment');
        });
      });
    }
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });

  function handleSelectedCustomerChange(
    value: SelectValue,
    _option: DefaultOptionType | DefaultOptionType[],
  ) {
    selectedCustomer.value = value as string;
    formData.customer_id = value as string;
  }

  function handleSelectedProductCategoryChange(
    value: SelectValue,
    _option: DefaultOptionType | DefaultOptionType[],
  ) {
    selectedProductCategory.value = value as string;
    formData.product_category_id = value as string;
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
      if (result) {
        sectionForm
          .querySelector('.section-search-input')
          ?.style.setProperty('max-height', `${result}px`, 'important');
      }
    }
  }

  function onCheck() {
    const checkedProcessIds = new Set<string>();
    const checkedEquipmentIds = new Set<string>();

    checkedKeys.value.forEach((key: string) => {
      const type = nodeTypeMap.get(key);
      if (type === 'process') {
        checkedProcessIds.add(key);
      } else if (type === 'equipment') {
        checkedEquipmentIds.add(key);
      }
    });

    formData.process_ids = Array.from(checkedProcessIds);
    formData.equipment_ids = Array.from(checkedEquipmentIds);
  }

  function handleSubmit() {
    const data = cleanAndFormatData(formData, filterType.value);
    if (data?.delivery_date) {
      data.delivery_date = dayjs(data.delivery_date).format('YYYY-MM-DD');
    }
    console.log(data);
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
