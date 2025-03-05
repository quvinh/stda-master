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

      <!-- <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <Divider style="margin: 4px 0; font-size: 14px">Thời gian truy vấn </Divider>
        <FormItem label="Ngày bắt đầu nhập" name="dates">
          <DatePicker aria-placeholder="Ngày bắt đầu nhập"
        /></FormItem>
        <FormItem label="Ngày kết thúc nhập" name="dates"> <DatePicker /></FormItem>
        <Divider style="margin: 4px 0; font-size: 14px">Điều kiện truy vấn </Divider>
        <FormItem label="Loại công việc bảo trì" name="maintenance_type">
          <Select v-model:value="formData.maintenance_type" placeholder="Chọn loại công việc">
            <Option
              v-for="job in props.filter.maintenanceType"
              :key="job.equipment_id"
              :value="job.maintenance_type"
            />
          </Select>
        </FormItem>
        <FormItem label="Đơn vị sử dụng" name="using_unit">
          <Input v-model:value="formData.using_unit" placeholder="Nhập đơn vị sử dụng"
        /></FormItem>
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
  import {
    Button,
    DatePicker,
    Form,
    FormItem,
    Input,
    Row,
    Select,
    Tree,
    Divider,
  } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { unref, ref, PropType, reactive, onMounted } from 'vue';
  import { DataNode } from 'ant-design-vue/lib/tree';
  import { useProcessStore } from '@/store/modules/states/process';
  import { IEquipmentMaintenancePlan } from '@/api/model/IEquipmentMaintenancePlan';

  const emit = defineEmits(['success']);
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        process?: string[];
        dates?: Dayjs[];
        maintenanceType: IEquipmentMaintenancePlan[];
      }>,
      default: () => ({
        process: [],
        dates: [dayjs()],
        maintenanceType: [],
      }),
    },
  });

  const formRef = ref();
  const formData = reactive<any>({
    process: props.filter.process,
    dates: props.filter.dates,
    using_unit: '',
    maintenance_type: props.filter.maintenanceType,
  });
  const treeData = ref<DataNode[]>([]);
  const checkedKeys = ref([]);
  const checkedChildren = ref([]);
  const processStore = useProcessStore();
  var myMap: Map<string, Pair[]> = new Map();
  type Pair = [string, string];

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
<style>
  .ant-picker {
    width: 100%;
  }
</style>
