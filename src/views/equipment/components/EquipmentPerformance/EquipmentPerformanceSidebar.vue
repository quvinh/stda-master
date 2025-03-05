<template>
  <Form
    :model="formData"
    @finish="handleSubmit"
    class="bg-white pl-2 pr-2 flex flex-col h-full section-form border-1 border-gray-300"
    layout="vertical"
  >
    <div class="flex-1 flex flex-col h-[calc(100%-60px)]">
      <div class="mb-0 mt-1">
        <Row class="flex flex-col flex-1">
          <Divider style="margin: 4px 0; font-size: 14px">Công đoạn </Divider>
          <FormItem label="" name="process">
            <div class="max-h-50 border border-gray-300 p-0 overflow-auto mb-0">
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
        <Divider style="margin: 8px 0; font-size: 14px">Thời gian truy vấn</Divider>
        <div class="filter-buttons">
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

        <Divider style="margin: 4px 0; font-size: 14px">Điều kiện truy vấn </Divider>
        <FormItem label="Lỗi dừng máy" name="error_equipment_id">
          <Select
            v-model:value="formData.error_equipment_id"
            placeholder="Vui lòng nhập"
            :options="errorEquipmentOptions"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>
        <FormItem label="Người kiểm tra" name="handler_id">
          <Select
            v-model:value="formData.handler_id"
            placeholder="Vui lòng nhập"
            :options="usersOptions"
            :allowClear="true"
            :showSearch="true"
          />
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
  import { Button, Form, FormItem, RangePicker, Row, Select, Tree, Divider } from 'ant-design-vue';
  import { DataNode } from 'ant-design-vue/lib/tree';
  import dayjs, { Dayjs } from 'dayjs';
  import { onUnmounted, ref, reactive, onMounted } from 'vue';
  import { ISelectOption } from '@/store/types/pagination';
  import UserResource from '@/api/resource/UserResource';
  import ErrorEquipmentResource from '@/api/resource/ErrorEquipmentResource';
  import { cleanAndFormatData } from "@/utils/sidebar";

  const emit = defineEmits(['success', 'quicker']);
  const nodeTypeMap = new Map<string, 'process' | 'equipment'>();

  const processStore = useProcessStore();

  interface FormDataType {
    process: string | undefined;
    dates: [Dayjs, Dayjs] | undefined;
    process_ids?: string[];
    equipment_ids?: string[];
    handler_id?: string;
    error_equipment_id?: string;
  }

  const formData = reactive<FormDataType>({
    process: undefined,
    dates: [dayjs(), dayjs()] as [Dayjs, Dayjs],
    process_ids: [],
    equipment_ids: [],
    handler_id: undefined,
    error_equipment_id: undefined,
  });
  const treeData = ref<DataNode[]>([]);
  const checkedKeys = ref<any[]>([]);
  const usersOptions = ref<ISelectOption[]>([]);
  const errorEquipmentOptions = ref<ISelectOption[]>([]);

  const filterType = ref<'day' | 'month' | 'week'>('day');

  function setFilterType(type) {
    filterType.value = type;
    console.log(type);
  }

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    const [processResponse, userRes, errorEquipmentRes] = await Promise.allSettled([
      processStore.search(),
      UserResource.getOptions(),
      ErrorEquipmentResource.getOptions(),
    ]);

    if (processResponse.status === 'fulfilled' && processResponse.value?.data) {
      treeData.value = processResponse.value.data.map((item: any) => {
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

    if (userRes.status === 'fulfilled') {
      usersOptions.value = userRes.value;
    }

    if (errorEquipmentRes.status === 'fulfilled') {
      errorEquipmentOptions.value = errorEquipmentRes.value;
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
