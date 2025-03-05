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
          <FormItem label="Công đoạn" name="process">
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

      <h3 class="text-center">Thời gian truy vấn</h3>
      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <div class="filter-buttons">
          <Button
            @click="setFilterType('day')"
            :type="filterType === 'day' ? 'primary' : 'default'"
            class="button"
            >Ngày</Button
          >
          <Button
            @click="setFilterType('week')"
            :type="filterType === 'week' ? 'primary' : 'default'"
            class="button"
            >Tuần</Button
          >
          <Button
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

        <FormItem v-if="filterType === 'year'" name="dates">
          <RangePicker v-model:value="formData.dates" picker="year" separator="đến" />
        </FormItem>
        <FormItem label="Lô sản xuất" name="batch_id">
          <Input placeholder="Vui lòng nhập"
        /></FormItem>
        <FormItem label="Mã sản phẩm" name="product_id">
          <Input placeholder="Vui lòng nhập"
        /></FormItem>
        <FormItem label="Kết quả kiểm tra" name="result">
          <Select
            placeholder="Vu lòng chọn"
            :options="[
              { label: 'OK', value: 'OK' },
              { label: 'NG', value: 'NG' },
            ]"
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
  import Icon from '@/components/Icon/Icon.vue';
  import { useProcessStore } from '@/store/modules/states/process';
  import { Button, Form, FormItem, Input, RangePicker, Row, Select, Tree } from 'ant-design-vue';
  import { DataNode } from 'ant-design-vue/lib/tree';
  import dayjs, { Dayjs } from 'dayjs';
  import { onUnmounted, unref, ref, PropType, reactive, onMounted } from 'vue';

  const emit = defineEmits(['success']);
  const checkedChildren = ref([]);
  var myMap: Map<string, Pair[]> = new Map();
  type Pair = [string, string];
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        process?: string[];
        dates?: Dayjs[];
      }>,
      default: () => ({
        process: [],
        dates: [dayjs(), dayjs()],
      }),
    },
  });

  const formRef = ref();
  const processStore = useProcessStore();
  const formData = reactive<any>({
    process: props.filter.process || [],
    dates: props.filter.dates,
  });
  const treeData = ref<DataNode[]>([]);
  const checkedKeys = ref([]);
  const filterType = ref('day');

  function setFilterType(type) {
    filterType.value = type;
  }

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    const response = await processStore.search();

    if (response?.data) {
      treeData.value = response.data.map((item: any) => ({
        title: item.name,
        key: item.id,
        children: item.equipments?.map((equipment: any) => ({
          title: equipment.id,
          key: equipment.id,
        })),
      }));
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
      console.log('height =', result);
      if (result) {
        sectionForm
          .querySelector('.section-search-input')
          ?.style.setProperty('max-height', `${result}px`, 'important');
      }
    }
  }

  function onCheck(checkedKeys: any, info: any) {
    let parentNode;
    if (info?.node?.parent) parentNode = info.node.parent.key;
    else parentNode = info.node.key;
    checkedChildren.value = getCheckedChildNodes(parentNode, treeData.value);
    let arr: Pair[] = [];
    checkedChildren.value.forEach((child) => {
      arr.push([child.title, child.key]);
    });
    myMap.set(parentNode, arr);
    const processObject = Object.fromEntries(myMap);
    formData.process = processObject;
  }

  const getCheckedChildNodes = (parentKey, data) => {
    const parentNode = data.find((node) => node.key === parentKey);
    if (!parentNode || !parentNode.children) {
      return [];
    }
    return parentNode.children.filter((child) => checkedKeys.value.includes(child.key));
  };

  function handleSubmit() {
    const form = unref(formRef);
    console.log(form.getFieldsValue());
    emit('success', form.getFieldsValue());
  }
</script>

<style lang="less" scoped>
  .filter-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
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
