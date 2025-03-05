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

      <h3 class="text-center">Thời gian truy vấn</h3>
      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <div class="filter-buttons">
          <Button
            @click="setFilterType('day')"
            size="small"
            :type="filterType === 'day' ? 'primary' : 'default'"
            class="button"
            >Ngày
          </Button>
          <Button
            @click="setFilterType('week')"
            size="small"
            :type="filterType === 'week' ? 'primary' : 'default'"
            class="button"
            >Tuần
          </Button>
          <Button
            @click="setFilterType('month')"
            size="small"
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

        <FormItem label="Mã lỗi thiết bị" name="batch_id">
          <Input placeholder="Vui lòng nhập"
        /></FormItem>
        <FormItem label="Người xử lý" name="lot_id">
          <Input placeholder="Vui lòng nhập"
        /></FormItem>
      </div>
    </div>

    <FormItem name="process_ids" :style="{ display: 'none' }">
      <input v-model="formData.process_ids" />
    </FormItem>
    <FormItem name="equipment_ids" :style="{ display: 'none' }">
      <input v-model="formData.equipment_ids" />
    </FormItem>

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
  import { Button, Divider, Form, FormItem, Input, RangePicker, Row, Tree } from 'ant-design-vue';
  import { DataNode } from 'ant-design-vue/lib/tree';
  import dayjs, { Dayjs } from 'dayjs';
  import { onUnmounted, unref, ref, PropType, reactive, onMounted } from 'vue';
  import { cleanAndFormatData } from '@/utils/sidebar';

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
        dates: [dayjs(), dayjs()],
        batch_id: '',
        lot_id: '',
      }),
    },
  });

  const formRef = ref();
  const formData = reactive<any>({
    dates: undefined,
    batch_id: props.filter.batch_id,
    lot_id: props.filter.lot_id,
    process_ids: [],
    equipment_ids: [],
  });
  const treeData = ref<DataNode[]>([]);
  const nodeTypeMap = new Map<string, 'process' | 'equipment'>();
  const processStore = useProcessStore();
  const checkedKeys = ref([]);
  const filterType = ref<'day' | 'week' | 'month'>('day');

  function setFilterType(type) {
    filterType.value = type;
  }

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    const response = await processStore.search();
    if (response?.data) {
      treeData.value = response.data.map((item: any) => {
        nodeTypeMap.set(item.id, 'process');
        const children = item.equipments?.map((equipment: any) => {
          nodeTypeMap.set(equipment.id, 'equipment');
          return {
            title: equipment.id,
            key: equipment.id,
          };
        });

        return {
          title: item.name,
          key: item.id,
          children,
        };
      });
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
    let data = unref(formRef).getFieldsValue();
    data = cleanAndFormatData(data, filterType.value);
    console.log('data =', data);
    emit('success', data);
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
