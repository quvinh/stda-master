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

      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <FormItem label="Ngày kiểm tra" name="dates">
          <RangePicker v-model:value="formData.dates" />
        </FormItem>

        <FormItem label="Mã Lot" name="lot_id">
          <Input placeholder="Vui lòng nhập" v-model:value="formData.lot_id" />
        </FormItem>

        <FormItem label="Mã lô sản xuất" name="batch_id">
          <Input placeholder="Vui lòng nhập" v-model:value="formData.batch_id" />
        </FormItem>

        <FormItem label="Người kiểm tra" name="inspector_name">
          <Input placeholder="Vui lòng nhập" v-model:value="formData.inspector_name" />
        </FormItem>

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
  import { Button, Form, FormItem, Input, RangePicker, Row, Tree } from 'ant-design-vue';
  import { DataNode } from 'ant-design-vue/lib/tree';
  import dayjs, { Dayjs } from 'dayjs';
  import { onUnmounted, onMounted, unref, ref, PropType, reactive } from 'vue';

  const treeData = ref<DataNode[]>([]);
  const processStore = useProcessStore();
  const emit = defineEmits(['success']);
  const checkedChildren = ref([]);
  var myMap: Map<string, Pair[]> = new Map();
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

  const formRef = ref();
  const formData = reactive<any>({
    process: props.filter.process || [], // Cập nhật để sử dụng process
    dates: props.filter.dates,
    batch_id: props.filter.batch_id,
    lot_id: props.filter.lot_id,
  });

  const checkedKeys = ref([]);

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
    console.log('processObject:', processObject);
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
    emit('success', form.getFieldsValue());
  }
</script>

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 6px !important;
  }
</style>
