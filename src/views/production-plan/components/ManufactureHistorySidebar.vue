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
          <Divider style="margin: 4px 0; font-size: 14px">Công đoạn </Divider>
          <FormItem name="process">
            <div class="max-h-50 border border-gray-300 p-0 overflow-auto">
              <Tree
                :treeData="treeData"
                v-model:checked-keys="checkedKeys"
                checkable
                :selectable="false"
                multiple
                @check="onCheck"
              />
            </div>
          </FormItem>
        </Row>
      </div>
      <Divider style="margin: 4px 0; font-size: 14px">Thời gian truy vấn </Divider>
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
        />
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
      <Divider style="margin: 1px 0; font-size: 14px">Điều kiện truy vấn </Divider>
      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <FormItem label="Mã sản phẩm" name="product_id">
          <Select
            v-model:value="formData.product_id"
            placeholder="Vui lòng nhập"
            :options="productOptions"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>

        <FormItem label="Mã lô" name="batch_id">
          <Select
            v-model:value="formData.batch_id"
            placeholder="Vui lòng nhập"
            :options="batchOptions"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>

        <FormItem label="Trạng thái" name="status">
          <Select
            v-model:value="formData.status"
            placeholder="Vui lòng nhập"
            :options="statuses"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>

        <!-- <FormItem label="Mã sản phẩm" name="product_id">
          <Input placeholder="Vui lòng nhập" v-model:value="formData.product_id" />
        </FormItem> -->

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
  import { IProduct } from '@/api/model/IProduct';
  import ProductResource from '@/api/resource/ProductResource';
  import Icon from '@/components/Icon/Icon.vue';
  import { useProcessStore } from '@/store/modules/states/process';
  import { ISelectOption } from '@/store/types/pagination';
  import { Button, Form, FormItem, RangePicker, Row, Tree, Select, Divider } from 'ant-design-vue';
  import { DataNode } from 'ant-design-vue/lib/tree';
  import dayjs, { Dayjs } from 'dayjs';
  import { onUnmounted, onMounted, ref, PropType, reactive } from 'vue';
  import { cleanAndFormatData } from "@/utils/sidebar";

  const treeData = ref<DataNode[]>([]);
  const processStore = useProcessStore();
  const emit = defineEmits(['success']);
  type Pair = [string, string];
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        process?: Map<string, Pair[]>;
        dates?: Dayjs[];
        batch_id?: string;
        lot_id?: string;
      }>,
      default: () => ({
        process: new Map<string, Pair[]>([]),
        dates: [dayjs(), dayjs()],
        batch_id: '',
        lot_id: '',
      }),
    },
  });
  const nodeTypeMap = new Map<string, 'process' | 'equipment'>();
  const formRef = ref();
  const formData = reactive<any>({
    dates: props.filter.dates,
    batch_id: props.filter.batch_id,
    lot_id: props.filter.lot_id,
    process_ids: [],
    equipment_ids: [],
  });

  const checkedKeys = ref([]);
  const filterType = ref<'day' | 'week' | 'month'>('day');
  const productOptions = ref<any>([{ label: 'Tất cả', value: '' }]);
  const batchOptions = ref<ISelectOption[]>([]);
  const statuses = ref<ISelectOption[]>([]);

  function setFilterType(type) {
    filterType.value = type;
  }

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    const response = await processStore.search();

    if (response?.data) {
      treeData.value = response.data.map((item: any) => {
        const processNode = {
          title: item.name,
          key: item.id,
          children: item.equipments?.map((equipment: any) => ({
            title: equipment.id,
            key: equipment.id,
          })),
        };
        nodeTypeMap.set(item.id, 'process');
        if (processNode.children) {
          processNode.children.forEach((child: any) => {
            nodeTypeMap.set(child.key, 'equipment');
          });
        }
        return processNode;
      });
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
    let data: any = { ...formData };
    data = cleanAndFormatData(data, filterType.value);
    emit('success', { ...data });
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
