<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <Tabs v-model:value="activeTab">
      <!-- Tab 1: Điều chỉnh thứ tự công đoạn -->
      <Tabs.TabPane key="sequence" tab="Điều chỉnh thứ tự công đoạn">
        <div class="draggable-container">
          <draggable
            v-model="sequenceList"
            handle=".drag-handle"
            @end="updateSequence"
            item-key="key"
          >
            <template #item="{ index }">
              <div
                :class="`drag-handle cursor-grab text-center ${index === 0 ? 'border-t border-gray-300' : ''}`"
              >
                <FormItem :label="index === 0 ? ' ' : ''">
                  <div class="flex flex-row justify-center items-center">
                    <Icon icon="ant-design:holder-outlined" />
                    <small>{{ index + 1 }}</small>
                  </div>
                </FormItem>
              </div>
            </template>
          </draggable>
        </div>
      </Tabs.TabPane>

      <!-- Tab 2: Điều chỉnh thông tin công đoạn -->
      <Tabs.TabPane key="information" tab="Điều chỉnh thông tin công đoạn">
        <Form ref="formItemRef" name="form_bom" :model="processForm" layout="vertical">
          <!-- Dropdown chọn công đoạn -->
          <FormItem label="Chọn công đoạn" name="selectedProcess">
            <Select v-model:value="processForm.selectedProcess" placeholder="Chọn công đoạn">
              <Select.Option
                v-for="option in processOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select>
          </FormItem>

          <!-- Thông tin chung -->
          <FormItem
            label="Công đoạn"
            name="process_id"
            :rules="[{ required: true, message: 'Vui lòng chọn công đoạn', trigger: 'change' }]"
          >
            <Select v-model:value="processForm.process_id" placeholder="Chọn công đoạn">
              <Select.Option
                v-for="option in processOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select>
          </FormItem>

          <FormItem
            label="Sản phẩm đầu ra"
            name="output_id"
            :rules="[{ required: true, message: 'Vui lòng chọn sản phẩm', trigger: 'change' }]"
          >
            <Select v-model:value="processForm.output_id" placeholder="Chọn sản phẩm">
              <Select.Option
                v-for="option in productOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select>
          </FormItem>

          <FormItem
            label="Đơn vị đầu ra"
            name="output_unit_id"
            :rules="[{ required: true, message: 'Vui lòng chọn đơn vị', trigger: 'change' }]"
          >
            <Select v-model:value="processForm.output_unit_id" placeholder="Chọn đơn vị">
              <Select.Option
                v-for="option in unitOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select>
          </FormItem>

          <!-- Danh sách nguyên liệu đầu vào -->
          <div class="input-materials">
            <div
              v-for="(item, index) in processForm.inputMaterials"
              :key="item.key"
              class="input-material-item"
            >
              <div class="flex gap-2 items-center">
                <FormItem :label="index === 0 ? 'Nguyên liệu đầu vào' : ''">
                  <Select v-model:value="item.input_id" placeholder="Chọn NVL">
                    <Select.Option
                      v-for="option in materialOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select>
                </FormItem>
                <FormItem :label="index === 0 ? 'Đơn vị' : ''">
                  <Select v-model:value="item.input_unit_id" placeholder="Chọn đơn vị">
                    <Select.Option
                      v-for="option in unitOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select>
                </FormItem>
                <Button type="link" danger @click="removeInputMaterial(index)">
                  <Icon icon="ant-design:delete-outlined" />
                </Button>
              </div>
            </div>
            <FormItem>
              <Button type="dashed" block @click="addInputMaterial">
                <Icon icon="ant-design:plus-outlined" /> Thêm NVL
              </Button>
            </FormItem>
          </div>
        </Form>
      </Tabs.TabPane>
    </Tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
  import { message, Tabs, Form, FormItem, Select, Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import draggable from 'vuedraggable';
  import { useModalInner } from '@/components/Modal';
  import ProductResource from '@/api/resource/ProductResource';
  import UnitResource from '@/api/resource/UnitResource';
  import ProcessResource from '@/api/resource/ProcessResource';
  import MaterialResource from '@/api/resource/MaterialResource';
  import type { ISelectOption } from '@/store/types/pagination';
  import BasicModal from '@/components/Modal/src/BasicModal.vue';

  const emit = defineEmits(['success']);

  // Sử dụng useModalInner để lấy registerModal theo mẫu SpecModal
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    await loadData();
    isUpdate.value = !!data?.isUpdate;
    if (isUpdate.value) {
      record.value = data.record;
      sequenceList.value = data.record.sequenceList || [];
      Object.assign(processForm, data.record.processInfo || {});
    } else {
      // Với tạo mới, sequenceList để trống
      sequenceList.value = [];
      addInputMaterial(); // Thêm dòng đầu tiên cho input NVL nếu cần
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const formItemRef = ref();
  const isUpdate = ref<boolean>(true);
  const record = ref<any>(null);
  const activeTab = ref('sequence');

  // sequenceList ban đầu để trống (sẽ được load từ record nếu cập nhật)
  const sequenceList = ref<
    Array<{ key: string; process_id?: string; process_name?: string; sequence?: number }>
  >([]);

  function updateSequence() {
    sequenceList.value.forEach((item, index) => {
      item.sequence = index + 1;
    });
  }

  const processOptions = ref<ISelectOption[]>([]);
  const productOptions = ref<ISelectOption[]>([]);
  const unitOptions = ref<ISelectOption[]>([]);
  const materialOptions = ref<ISelectOption[]>([]);

  onMounted(() => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    ProcessResource.getOptions().then((res) => {
      processOptions.value = res;
    });
    ProductResource.getOptions().then((res) => {
      productOptions.value = res;
    });
    UnitResource.getOptions().then((res) => {
      unitOptions.value = res;
    });
    MaterialResource.getOptions().then((res) => {
      materialOptions.value = res;
    });
  });
  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });
  function updateHeight() {
    // Cập nhật chiều cao nếu cần
  }

  // Dữ liệu cho form Tab 2
  const processForm = reactive({
    selectedProcess: undefined,
    process_id: undefined,
    output_id: undefined,
    output_unit_id: undefined,
    inputMaterials: [] as Array<{ key: string; input_id?: string; input_unit_id?: string }>,
  });

  function addInputMaterial() {
    processForm.inputMaterials.push({
      key: Date.now().toString(),
      input_id: undefined,
      input_unit_id: undefined,
    });
  }

  function removeInputMaterial(index: number) {
    processForm.inputMaterials.splice(index, 1);
  }

  const getTitle = computed(() => (isUpdate.value ? 'Chỉnh sửa BOM' : 'Tạo mới BOM'));

  async function loadData() {
    // Reset form cho trường hợp tạo mới
    processForm.selectedProcess = undefined;
    processForm.process_id = undefined;
    processForm.output_id = undefined;
    processForm.output_unit_id = undefined;
    processForm.inputMaterials = [];
    if (!isUpdate.value) {
      sequenceList.value = [];
    }
  }

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      // Validate form (giả sử formItemRef.value.validate() trả về dữ liệu hợp lệ)
      const values = await formItemRef.value?.validate();
      console.log(values);
      const payload = {
        sequenceList: sequenceList.value,
        processInfo: processForm,
      };
      console.log(payload);
      // Gọi API cập nhật/tạo BOM (thay bằng API thực tế)
      // await updateBOMApi(payload);
      message.success('Cập nhật BOM thành công');
      emit('success');
      closeModal();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>

<style scoped>
  .draggable-container {
    margin-bottom: 16px;
    padding: 10px;
    border: 1px solid #f0f0f0;
  }

  .process-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #f0f0f0;
  }

  .drag-handle {
    margin-right: 10px;
    cursor: grab;
  }

  .input-materials {
    margin-top: 16px;
  }

  .input-material-item {
    margin-bottom: 10px;
  }
</style>
