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
          <Divider style="margin: 1px 0; font-size: 14px">Vị trí kho </Divider>
          <FormItem label="" name="process">
            <div class="max-h-50 border border-gray-300 p-0 overflow-auto mb-0">
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
      <div class="filter-buttons pb-1">
        <Button
          size="small"
          @click="setFilterType('day')"
          :type="filterType === 'day' ? 'primary' : 'default'"
          class="button"
          >Ngày</Button
        >
        <Button
          size="small"
          @click="setFilterType('week')"
          :type="filterType === 'week' ? 'primary' : 'default'"
          class="button"
          >Tuần</Button
        >
        <Button
          size="small"
          @click="setFilterType('month')"
          :type="filterType === 'month' ? 'primary' : 'default'"
          class="button"
          >Tháng</Button
        >
        <!-- <Button
            @click="setFilterType('year')"
            :type="filterType === 'year' ? 'primary' : 'default'"
            class="button"
            >Năm</Button
          > -->
      </div>

      <FormItem v-if="filterType === 'day'" name="dates">
        <RangePicker
          v-model:value="formData.dates"
          separator="đến"
          format="DD-MM-YYYY"
          @change="handleDateChange"
        />
      </FormItem>

      <FormItem v-if="filterType === 'week'" name="dates">
        <RangePicker
          v-model:value="formData.dates"
          picker="week"
          separator="đến"
          format="WW-YYYY"
          @change="handleDateChange"
        />
      </FormItem>

      <FormItem v-if="filterType === 'month'" name="dates">
        <RangePicker
          v-model:value="formData.dates"
          picker="month"
          separator="đến"
          format="MM-YYYY"
          @change="handleDateChange"
        />
      </FormItem>

      <FormItem v-if="filterType === 'year'" name="dates">
        <RangePicker
          v-model:value="formData.dates"
          picker="year"
          separator="đến"
          @change="handleDateChange"
        />
      </FormItem>
      <Divider style="margin: 1px 0; font-size: 14px">Điều kiện truy vấn </Divider>
      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <FormItem label="Chọn loại" name="type">
          <Select
            v-model:value="formData.type"
            :options="[
              { value: 'material', label: 'Nguyên vật liệu' },
              { value: 'finished-product', label: 'Thành phẩm' },
            ]"
          />
        </FormItem>
        <FormItem
          :label="formData.type === 'material' ? 'Mã NVL' : 'Mã thành phẩm'"
          name="material_id"
        >
          <AutoComplete
            v-model:value="formData.material_id"
            :options="formData.type === 'material' ? materialOptions : productOptions"
            @search="handleSearchMaterial"
            placeholder="Vui lòng nhập"
            allowClear
          />
        </FormItem>

        <!-- <FormItem label="Trạng thái" name="status">
          <Select
            placeholder="Vui lòng chọn"
            :options="[
              { label: 'Chưa kiểm tra', value: 0 },
              { label: 'Không đạt', value: 1 },
              { label: 'Đạt', value: 2 },
            ]"
        /></FormItem> -->
        <FormItem label="Nhập/Xuất" name="method">
          <Select
            placeholder="Vui lòng chọn"
            :options="[
              { label: 'Tất cả', value: 'all' },
              { label: 'Nhập', value: 'import' },
              { label: 'Xuất', value: 'export' },
            ]"
            v-model:value="formData.method"
        /></FormItem>

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
  import { searchWarehouseApi } from '@/api/sys/warehouse';
  import { searchMaterialApi } from '@/api/sys/material';
  import Icon from '@/components/Icon/Icon.vue';
  import {
    Button,
    Form,
    FormItem,
    RangePicker,
    Row,
    Select,
    Tree,
    Divider,
    AutoComplete,
  } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { onUnmounted, unref, ref, PropType, reactive, onMounted } from 'vue';
  import { ISelectOption } from '@/store/types/pagination';
  import { searchProductApi } from '@/api/sys/product';

  const emit = defineEmits(['success']);
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        tree?: string[];
        dates?: Dayjs[];
      }>,
      default: () => ({
        tree: [],
        dates: [dayjs(), dayjs()],
      }),
    },
  });

  const myMap = ref<Map<string, any[]>>(new Map());
  const formRef = ref<any>();
  const formData = reactive<any>({
    tree: props.filter.tree || [],
    dates: props.filter.dates,
    method: 'all',
    type: 'material',
    material_id: undefined,
  });
  const treeData = ref<any[]>([]);
  const checkedKeys = ref<any[]>([]);
  const checkedChildren = ref<any[]>([]);
  const filterType = ref('day');
  const timer = ref<any>();
  const materialOptions = ref<{ value: string; text: string }[]>([]);
  const productOptions = ref<ISelectOption[]>([]);

  function setFilterType(type) {
    filterType.value = type;
  }

  onMounted(() => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    loadTreeData();

    handleSearchMaterial();
    handleSearchFinishedProduct();
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

  const getCheckedChildNodes = (parentKey, data) => {
    const parentNode = data.find((node) => node.key === parentKey);
    if (!parentNode || !parentNode.children) {
      return [];
    }
    return parentNode.children.filter((child) => checkedKeys.value.includes(child.key));
  };

  function onCheck(_, info: any) {
    let parentNode;
    let arr: any[] = [];
    if (info?.node?.parent) parentNode = info.node.parent.key;
    else parentNode = info.node.key;
    checkedChildren.value = getCheckedChildNodes(parentNode, treeData.value);
    checkedChildren.value.forEach((child) => {
      arr.push(child.key);
    });
    myMap.value.set(parentNode, arr);
    // const obj = Object.fromEntries(myMap.value);
    formData.tree = myMap.value;
  }

  function handleSubmit() {
    const data = unref(formRef).getFieldsValue();
    if (data?.dates?.length === 2) {
      data.start_date = dayjs(data.dates[0]).format('YYYY-MM-DD');
      data.end_date = dayjs(data.dates[1]).format('YYYY-MM-DD');
      delete data.dates;
    }
    emit('success', data);
  }

  async function loadTreeData() {
    const response: any = await searchWarehouseApi();
    if (response?.data) {
      treeData.value = response.data?.map((item) => {
        return {
          title: item?.id,
          key: item?.id,
          type: 'warehouse',
          children: (item?.locations || []).map((child) => ({
            title: child?.id,
            key: child?.id,
            type: 'warehouse_location',
          })),
        };
      });
    }
  }

  function handleDateChange(dates: [Dayjs, Dayjs] | [string, string]) {
    if (dates && dates.length === 2) {
      const startDate = dates[0] instanceof dayjs ? dates[0] : dayjs(dates[0]);
      const endDate = dates[1] instanceof dayjs ? dates[1] : dayjs(dates[1]);
      var start = startDate;
      var end = endDate;
      if (filterType.value === 'week') {
        start = startDate.startOf('week').add(1, 'day');
        end = endDate.endOf('week').add(1, 'day');
      } else {
        if (filterType.value === 'month') {
          start = startDate.startOf('month');
          end = endDate.endOf('month');
        }
      }

      const dataDates: any = [start, end];
      formData.dates = dataDates;
    } else {
      formData.dates = undefined;
    }
  }

  async function handleSearchMaterial(value = '') {
    const res: any = await searchMaterialApi({
      id: value,
      page: 1,
      pageSize: 10,
    });
    if (res?.data) {
      materialOptions.value = res.data?.map(({ id }) => ({ value: id, text: id }));
    }
  }

  async function handleSearchFinishedProduct(value = '') {
    const res: any = await searchProductApi({
      id: value,
      page: 1,
      pageSize: 10,
    });
    if (res?.data) {
      productOptions.value = res.data?.map(({ id }) => ({ value: id, text: id }));
    }
  }
</script>
<style lang="less" scoped>
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
