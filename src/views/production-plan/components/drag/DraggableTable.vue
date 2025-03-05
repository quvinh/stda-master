<template>
  <div class="overflow-auto h-full bg-white flex flex-col">
    <div class="h-[calc(100%-30px)] overflow-auto relative">
      <table class="min-w-full border-collapse">
        <!-- Fixed Header -->
        <thead class="sticky top-0 bg-blue-600 text-white z-30">
          <tr>
            <th
              v-for="col in props.columns"
              :key="col.dataIndex"
              :align="col?.align ?? 'left'"
              :class="getHeaderCellClass(col)"
              :style="{
                minWidth: col.width + 'px',
                zIndex: col.dataIndex === '#' ? 35 : 30,
              }"
              class="px-2 py-1 border"
            >
              {{ col.title }}
            </th>
          </tr>
        </thead>

        <!-- Draggable Body -->
        <Draggable
          v-model="list"
          tag="tbody"
          handle=".drag-handle"
          :animation="200"
          @start="onStart"
          @end="onEnd"
        >
          <template #item="{ element }">
            <tr :key="element.id" class="hover:bg-gray-100">
              <!-- Draggable Handle Column -->
              <td
                class="drag-handle cursor-move sticky left-0 bg-white z-31 border"
                align="center"
                :style="{
                  minWidth: props.columns.find((col) => col.dataIndex === '#')?.width + 'px',
                }"
              >
                <Icon icon="ant-design:holder-outlined" />
              </td>

              <!-- Data Columns -->
              <td
                v-for="col in props.columns.filter(
                  (item: any) => !['#', 'action', 'status'].includes(item.dataIndex),
                )"
                :key="col.dataIndex"
                class="border px-2 py-1"
                :style="{ minWidth: col.width + 'px' }"
              >
                {{ element[col.dataIndex] }}
              </td>

              <td
                :style="{
                  minWidth: props.columns.find((col) => col.dataIndex === 'status')?.width + 'px',
                }"
              >
                <Tag v-if="element.status === 1" color="#0960bd">Đang thực hiện</Tag>
                <Tag v-else-if="element.status === 2" color="#098b3e">Hoàn thành</Tag>
                <Tag v-else-if="element.status === 3" color="#e15353">Đã dừng</Tag>
                <Tag v-else-if="element.status === 4" color="#909399">Đã hủy</Tag>
                <Tag v-else color="#faad14">Đang chờ</Tag>
              </td>

              <!-- Fixed Action Column -->
              <td
                class="sticky right-0 bg-white z-31 border text-center px-2 py-1"
                :style="{
                  minWidth: props.columns.find((col) => col.dataIndex === 'action')?.width + 'px',
                }"
              >
                <Space>
                  <Popconfirm
                    v-if="element?.status === 1"
                    placement="topRight"
                    title="Xác nhận dừng đơn?"
                    ok-text="Đồng ý"
                    cancel-text="Hủy"
                    @confirm="() => handlePause(element)"
                  >
                    <Button :style="{ padding: 0 }" size="small" type="link">
                      <Icon icon="ant-design:pause-outlined" />
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    v-if="element?.status === 3"
                    placement="topRight"
                    title="Xác nhận tiếp tục sản xuất?"
                    ok-text="Đồng ý"
                    cancel-text="Hủy"
                    @confirm="() => handlePause(element)"
                  >
                    <Button :style="{ padding: 0 }" size="small" type="link">
                      <Icon icon="ant-design:caret-right-filled" />
                    </Button>
                  </Popconfirm>
                  <Button
                    v-if="element?.status === 0"
                    :style="{ padding: 0 }"
                    size="small"
                    type="link"
                    @click="() => handleEdit(element)"
                  >
                    <Icon icon="ant-design:edit-outlined" />
                  </Button>
                  <Button
                    :style="{ padding: 0 }"
                    size="small"
                    type="link"
                    @click="() => handleShow(element)"
                  >
                    <Icon icon="ant-design:eye-outlined" />
                  </Button>
                </Space>
              </td>
            </tr>
          </template>
        </Draggable>
      </table>
    </div>

    <div class="h-[25px] text-right">
      <Pagination
        size="small"
        show-size-changer
        :default-current="props.pagination.current"
        :total="props.pagination.total"
        :show-total="(total) => `Tổng ${total} bản ghi`"
        :page-size="props.pagination.pageSize"
        @show-size-change="onShowSizeChange"
        @change="onPageChange"
      />
    </div>

    <!-- Confirmation Modal -->
    <Modal
      title="Xác Nhận Đổi Vị Trí"
      v-model:visible="isModalVisible"
      @ok="handleConfirm"
      @cancel="handleCancel"
      ok-text="Xác nhận"
      cancel-text="Hủy"
    >
      <p>Bạn có chắc chắn muốn đổi vị trí hàng này không?</p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, ref, watch } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { Button, message, Space, Modal, Pagination, Tag, Popconfirm } from 'ant-design-vue';
  import Draggable from 'vuedraggable';

  const emit = defineEmits(['size-change']);

  const props = defineProps({
    columns: {
      type: Array as PropType<any[]>,
      required: true,
    },
    dataSource: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    pagination: {
      type: Object as PropType<any>,
      required: true,
    },
  });

  // Initialize the list with reactive data
  const list = ref<any[]>(props.dataSource);

  // Store the original list before dragging
  const originalList = ref<any[]>([]);

  // Modal visibility state
  const isModalVisible = ref(false);

  // Variables to store dragged item info
  const draggedItem = ref<any | null>(null);
  const draggedOldIndex = ref<number | null>(null);
  const draggedNewIndex = ref<number | null>(null);

  // Utility function to determine header cell classes
  const getHeaderCellClass = (col: any): string => {
    if (col.dataIndex === '#') {
      return 'sticky left-0 bg-blue-600 z-35 text-center';
    }
    if (col.dataIndex === 'action') {
      return 'sticky right-0 bg-blue-600 z-30 text-center';
    }
    return '';
  };

  // Function to handle showing record details
  function handleShow(record: any) {
    console.log(record);
  }

  // Function to handle confirming the drag action
  const handleConfirm = async () => {
    isModalVisible.value = false;
    message.success(
      `Đã di chuyển đơn ${draggedItem.value?.id} từ vị trí ${draggedOldIndex.value! + 1} đến vị trí ${draggedNewIndex.value! + 1}`,
    );

    // Gửi thứ tự mới lên backend

    // Reset dragged info
    draggedItem.value = null;
    draggedOldIndex.value = null;
    draggedNewIndex.value = null;
  };

  // Function to handle cancelling the drag action
  const handleCancel = () => {
    isModalVisible.value = false;
    if (originalList.value.length) {
      list.value = JSON.parse(JSON.stringify(originalList.value));
      message.info('Đã hủy thay đổi vị trí.');
    }
    // Reset dragged info
    draggedItem.value = null;
    draggedOldIndex.value = null;
    draggedNewIndex.value = null;
  };

  // Function to handle the start of dragging
  const onStart = (event: any) => {
    draggedOldIndex.value = event.oldIndex;
    draggedItem.value = list.value[event.oldIndex];
    // Deep copy the original list
    originalList.value = JSON.parse(JSON.stringify(list.value));
    console.log('Bắt đầu kéo:', draggedItem.value);
  };

  // Function to handle the end of dragging
  const onEnd = (event: any) => {
    draggedNewIndex.value = event.newIndex;

    if (draggedOldIndex.value !== draggedNewIndex.value) {
      // Show confirmation modal
      isModalVisible.value = true;
    } else {
      // No change in position
      draggedItem.value = null;
      draggedOldIndex.value = null;
      draggedNewIndex.value = null;
    }

    console.log(`Hoàn tất di chuyển:`, draggedItem.value);
    console.log(`Từ vị trí: ${draggedOldIndex.value} đến vị trí: ${draggedNewIndex.value}`);
  };

  const onShowSizeChange = (current, pageSize) => {
    emit('size-change', { current, pageSize });
  };

  const onPageChange = (current, pageSize) => {
    emit('size-change', { current, pageSize });
  };

  const handlePause = (record: any) => {
    console.log(record);
  };

  function handleEdit(record: any) {
    console.log(record);
  }

  watch(
    () => props.dataSource,
    (newProps) => {
      list.value = newProps || [];
      console.log(newProps, props);
    },
  );
</script>

<style lang="scss" scoped>
  $bg-cell: rgb(242 254 255);

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;

    th,
    td {
      padding: 2px 6px;
      border: 1px solid #ccc;
      background-clip: padding-box;
    }

    thead {
      th {
        position: sticky;
        z-index: 30;
        top: 0;
        padding: 8px 6px !important;
        background-color: #005baa; /* Tailwind's bg-blue-600 equivalent */
        color: #fff; /* Đặt màu chữ cho tiêu đề để dễ nhìn hơn */
      }
    }

    tbody {
      tr {
        &:hover {
          background-color: #f1f1f1; /* Tailwind's hover:bg-gray-100 equivalent */
        }

        td {
          position: relative;
        }

        /* Fixed First Column (#) */
        .drag-handle {
          z-index: 20;
          left: 0;
          background-color: $bg-cell !important;
        }

        /* Fixed Action Column */
        .sticky.right-0 {
          z-index: 20;
          right: 0;
          background-color: $bg-cell !important;
        }
      }

      td.sticky.left-0,
      td.sticky.right-0,
      th.sticky.right-0 {
        position: sticky;
        background-color: #fff;
      }
    }
  }

  .overflow-auto::-webkit-scrollbar {
    height: 6px;
  }

  .overflow-auto::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgb(0 0 0 / 20%);
  }
</style>
