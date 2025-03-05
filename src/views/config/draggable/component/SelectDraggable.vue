<template>
  <draggable
    class="flex flex-col h-full bg-white"
    v-model="items"
    item-key="id"
    animation="300"
    chosenClass="chosen"
    forceFallback="true"
    @end="onDragEnd"
    :disabled="!editable"
  >
    <template #item="{ element }">
      <div class="h-1/2">
        <Row class="h-full">
          <Col
            span="10"
            class="oi-bg-blue flex justify-center items-center text-white border-b border-white"
          >
            <span>{{ element.text }}</span>
          </Col>
          <Col span="14">
            <Select
              :options="element.options"
              v-model:value="element.selected"
              class="oi-select w-full h-full"
              optionFilterProp="label"
              showSearch
              @change="handleChange"
            />
          </Col>
        </Row>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
  import { ISelectOption } from '@/store/types/pagination';
  import { Col, Row, Select } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  import draggable from 'vuedraggable/src/vuedraggable';

  interface IItem {
    id: number | string;
    text: string;
    options: ISelectOption[];
    selected: string | undefined;
  }

  const props = defineProps({
    editable: {
      type: Boolean,
      default: () => true,
    },
  });
  const editable = ref<Boolean>(props.editable);

  const items = ref<IItem[]>([
    {
      id: 1,
      text: 'Công đoạn',
      options: [
        { label: 'CNC', value: 'CNC' },
        { label: 'CP', value: 'CP' },
      ],
      selected: 'CNC',
    },
    {
      id: 2,
      text: 'Máy',
      options: [
        { label: 'CNC05', value: 'CNC05' },
        { label: 'CNC09', value: 'CNC09' },
        { label: 'CATPHAY04', value: 'CATPHAY04' },
      ],
      selected: 'CNC09',
    },
  ]);

  // Biến để lưu JSON
  // const savedJson = ref<string>('');

  // // Hàm lưu vị trí và giá trị dưới dạng JSON
  // const savePositions = () => {
  //   savedJson.value = JSON.stringify(items.value, null, 2); // Chuyển thành JSON
  //   console.log('Vị trí được lưu:', savedJson.value); // Hiển thị trong console
  // };

  // Hàm gọi khi kéo thả kết thúc
  const onDragEnd = () => {
    // console.log('Danh sách sau khi kéo thả:', items.value);
    // savePositions(); // Lưu vị trí ngay sau khi kéo thả
  };

  function handleChange(item) {
    console.log(item);
  }

  watch(
    () => props.editable,
    (newValue) => {
      editable.value = newValue;
    },
  );
</script>
