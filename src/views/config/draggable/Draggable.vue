<template>
  <div>
    <draggable
      v-model="items"
      class="oi-content p-2 gap-1 flex flex-col"
      item-key="id"
      animation="300"
      chosenClass="chosen"
      forceFallback="true"
      @end="() => {}"
      :disabled="!editable"
    >
      <template #item="{ element }">
        <div class="w-full" :key="element.id">
          <component :is="element.component" v-bind="element.props" />
        </div>
      </template>
    </draggable>
    <div class="pr-2 pl-2 mt-1">
      <Table
        rowKey="id"
        class="table-production"
        size="small"
        :columns="columnsTable"
        :dataSource="[]"
        :bordered="true"
        :pagination="false"
        :scroll="{ x: 1200 }"
      />
    </div>
    <!-- <FloatButton
      shape="square"
      class="w-[180px]"
      style="right: 80px"
      :description="`Chế độ chỉnh sửa đang ${editable ? 'Bật' : 'Tắt'}`"
    />
    <FloatButtonGroup trigger="click" type="primary">
      <template #icon>
        <Icon icon="ant-design:setting-outlined" />
      </template>
      <FloatButton
        :tooltip="`${editable ? 'Tắt' : 'Bật'} chế độ chỉnh sửa`"
        @click="handleEditable"
      >
        <template #icon>
          <Icon :icon="`${editable ? 'line-md:cog-off' : 'line-md:pencil'}`" />
        </template>
      </FloatButton>
      <FloatButton tooltip="Lưu chỉnh sửa" @click="savePositions">
        <template #icon>
          <Icon icon="tdesign:save" />
        </template>
      </FloatButton>
    </FloatButtonGroup> -->
    <FloatButton @click="showDrawer" type="primary">
      <template #icon>
        <Icon icon="ant-design:setting-outlined" />
      </template>
    </FloatButton>

    <Drawer v-model:open="openDrawer" title="Tùy chỉnh" placement="right">
      <Space direction="vertical" class="w-full">
        <div class="flex justify-between items-center">
          <span>Kéo thả giao diện</span>
          <Switch
            v-model:checked="editable"
            @change="handleEditChange"
            :checkedChildren="'Bật'"
            :unCheckedChildren="'Tắt'"
          />
        </div>
        <Select
          v-model:value="viewSelected"
          :options="viewOptions"
          class="w-full"
          placeholder="Chọn giao diện"
        />
        <Button block type="primary" @click="savePositions">Lưu thay đổi</Button>
      </Space>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import draggable from 'vuedraggable/src/vuedraggable';
  import SectionTopDraggable from './component/SectionTopDraggable.vue';
  import TableComponent from './component/TableComponent.vue';
  import ButtonDraggable from './component/ButtonDraggable.vue';
  import { oiProductionBottomColumns } from '@/views/oi-views/production/components/tableOIProduction';
  import {
    columnsBottom as columnsBottomPQC,
    columnsMiddle as columnsMiddlePQC,
  } from '@/views/oi-views/quality/components/tableOIQualityOQC';
  import {
    Button,
    Drawer,
    FloatButton,
    Select,
    Space,
    Switch,
    Table,
    message,
  } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ColumnType } from 'ant-design-vue/es/table';
  import { ISelectOption } from '@/store/types/pagination';
  import SectionMiddleDraggable from './component/SectionMiddleDraggable.vue';
  import ButtonComponent from './component/ButtonComponent.vue';

  interface IItem {
    id: number | string;
    component: any;
    props: any | undefined;
  }

  const openDrawer = ref<boolean>(false);
  const columnsMiddle: any[] = [
    { title: 'Mã LSX', dataIndex: 'batch_id' },
    { title: 'Số lượng KH', dataIndex: 'quantity_plan' },
  ];

  const editable = ref<boolean>(false);
  const items = ref<IItem[]>([
    { id: 1, component: SectionTopDraggable, props: { editable: editable.value } },
    { id: 2, component: TableComponent, props: { columns: columnsMiddle, data: [] } },
    { id: 3, component: ButtonDraggable, props: { editable: editable.value } },
  ]);
  const columnsTable = ref<ColumnType[]>(oiProductionBottomColumns);
  const viewOptions = ref<ISelectOption[]>([
    { label: 'OI sản xuất', value: 'oi-production' },
    { label: 'OI PQC', value: 'oi-pqc' },
  ]);
  const viewSelected = ref<string>('oi-production');

  const showDrawer = () => {
    openDrawer.value = true;
  };

  // function handleEditable() {
  //   const current = editable.value;
  //   editable.value = !current;
  //   items.value = [
  //     { id: 1, component: SectionTopDraggable, props: { editable: editable.value } },
  //     { id: 2, component: TableComponent, props: { columns: columnsMiddle, data: [] } },
  //     { id: 3, component: ButtonDraggable, props: { editable: editable.value } },
  //   ];
  // }

  function savePositions() {
    message.info('comming soon');
    console.log('Vị trí được lưu:', JSON.stringify(items.value, null, 2));
  }

  function handleEditChange() {
    switch (viewSelected.value) {
      case 'oi-production':
        items.value = [
          { id: 1, component: SectionTopDraggable, props: { editable: editable.value } },
          { id: 2, component: TableComponent, props: { columns: columnsMiddle, data: [] } },
          { id: 3, component: ButtonDraggable, props: { editable: editable.value } },
        ];
        break;
      case 'oi-pqc':
        items.value = [
          { id: 1, component: SectionTopDraggable, props: { editable: editable.value } },
          {
            id: 2,
            component: SectionMiddleDraggable,
            props: {
              editable: editable.value,
              items: [
                {
                  id: '2.1',
                  col: { span: 21, xs: 24, sm: 21, class: 'section-middle' },
                  component: TableComponent,
                  props: { columns: columnsMiddlePQC, data: [] },
                },
                {
                  id: '2.2',
                  col: { span: 3, xs: 24, sm: 3, class: 'bg-white' },
                  component: ButtonComponent,
                  props: {
                    type: 'primary',
                    text: 'Kiểm tra chỉ tiêu',
                    block: true,
                    class: 'oi-row-button h-full',
                  },
                },
              ],
            },
          },
          // { id: 2, component: TableComponent, props: { columns: columnsMiddlePQC, data: [] } },
          // { id: 3, component: ButtonDraggable, props: { editable: editable.value } },
        ];
        break;
      default:
        break;
    }
  }

  watch(
    () => viewSelected.value,
    (newValue) => {
      console.log(newValue);
      switch (newValue) {
        case 'oi-production':
          columnsTable.value = oiProductionBottomColumns;
          break;
        case 'oi-pqc':
          columnsTable.value = columnsBottomPQC;
          break;
        default:
          break;
      }
      handleEditChange();
    },
    { deep: true },
  );
</script>
