<template>
  <Row :gutter="[8, 8]">
    <draggable
      v-model="items"
      class="md:flex w-full"
      item-key="id"
      animation="300"
      chosenClass="chosen"
      forceFallback="true"
      :disabled="!editable"
    >
      <template #item="{ element }">
        <Col
          :span="element.col.span"
          :xs="element.col.xs"
          :sm="element.col.sm"
          :class="element.col.class"
        >
          <component :is="element.component" v-bind="element.props" />
        </Col>
      </template>
    </draggable>
  </Row>
</template>

<script setup lang="ts">
  import { Col, Row } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  import draggable from 'vuedraggable/src/vuedraggable';
  import SelectDraggable from './SelectDraggable.vue';
  import TableComponent from './TableComponent.vue';

  interface IItem {
    id: number | string;
    col: { span: number; xs: number; sm: number; class: string };
    component: any;
    props: any | undefined;
  }

  const props = defineProps({
    editable: {
      type: Boolean,
      default: () => true,
    },
  });
  const editable = ref<Boolean>(props.editable);

  const columns: any[] = [
    { title: 'Tổng SL KH', dataIndex: 'totalPlan', customRender: ({ value }) => Number(value) },
    { title: 'Tổng SL OK', dataIndex: 'totalOK', customRender: ({ value }) => Number(value) },
    { title: 'Tổng SL NG', dataIndex: 'totalNG', customRender: ({ value }) => Number(value) },
    {
      title: 'Tỉ lệ hoàn thành',
      dataIndex: 'totalComplete',
      customRender: ({ value }) => Number(value),
    },
  ];

  const items = ref<IItem[]>([
    {
      id: 1,
      col: { span: 8, xs: 24, sm: 8, class: 'section-top' },
      component: SelectDraggable,
      props: { editable: editable.value },
    },
    {
      id: 2,
      col: { span: 16, xs: 24, sm: 16, class: 'bg-white' },
      component: TableComponent,
      props: { columns, data: [] },
    },
  ]);

  watch(
    () => props.editable,
    (newValue) => {
      editable.value = newValue;
      items.value = [
        {
          id: 1,
          col: { span: 8, xs: 24, sm: 8, class: 'section-top' },
          component: SelectDraggable,
          props: { editable: editable.value },
        },
        {
          id: 2,
          col: { span: 16, xs: 24, sm: 16, class: 'bg-white' },
          component: TableComponent,
          props: { columns, data: [] },
        },
      ];
    },
  );
</script>
