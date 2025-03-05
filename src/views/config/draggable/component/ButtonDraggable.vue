<template>
  <draggable
    v-model="items"
    class="flex gap-1"
    item-key="id"
    animation="300"
    chosenClass="chosen"
    forceFallback="true"
    @end="onDragEnd"
    :disabled="!editable"
  >
    <template #item="{ element }">
      <Button :type="element.type" :size="element.size" @click="() => handleClick(element)" block
        ><Icon v-if="element.icon" class="mr-1" :icon="element.icon" />{{ element.text }}</Button
      >
    </template>
  </draggable>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Button } from 'ant-design-vue';
  import draggable from 'vuedraggable/src/vuedraggable';
  import Icon from '@/components/Icon/Icon.vue';

  interface IItem {
    id: number | string;
    text: string;
    icon: string | undefined;
    type: string | undefined;
    size: string;
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
      text: 'Bắt đầu',
      icon: 'ant-design:step-forward-outlined',
      size: 'middle',
      type: 'primary',
    },
    { id: 2, text: 'In tem', icon: 'ant-design:printer-outlined', size: 'middle', type: 'primary' },
    {
      id: 3,
      text: 'Nhập số lượng',
      icon: 'ant-design:edit-outlined',
      size: 'middle',
      type: 'primary',
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

  function handleClick(item: IItem) {
    console.log(item);
  }

  watch(
    () => props.editable,
    (newValue) => {
      editable.value = newValue;
    },
  );
</script>
