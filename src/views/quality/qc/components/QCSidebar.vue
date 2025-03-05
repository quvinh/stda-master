<template>
  <Form
    :model="formData"
    @finish="handleSubmit"
    class="bg-white pl-2 pr-2 flex flex-col h-full section-form border-1 border-gray-300"
    layout="vertical"
  >
    <div class="flex-1 flex flex-col h-[calc(100%-60px)]">
      <div class="mb-0">
        <Row class="flex flex-col flex-1">
          <Divider style="margin: 4px 0; font-size: 14px">Công đoạn</Divider>
          <FormItem label="" name="process">
            <div class="max-h-42 border border-gray-300 p-0 overflow-auto mb-0">
              <Skeleton :loading="treeData.length === 0" active>
                <Tree
                  :treeData="treeData"
                  v-model:checked-keys="checkedKeys"
                  checkable
                  :selectable="false"
                  multiple
                  @check="onCheck"
                />
              </Skeleton>
            </div>
          </FormItem>
        </Row>
        <Row class="flex flex-col flex-1">
          <Divider style="margin: 0; font-size: 14px">Quicker</Divider>
          <div>
            <ul class="list-disc pl-5 mb-0">
              <li
                :class="`cursor-pointer underline ${
                  quicker === 'ddqc' ? 'text-sky-800 font-600' : ''
                }`"
                @click="handleQuicker('ddqc')"
              >
                QC tách bài
              </li>
              <li
                :class="`cursor-pointer underline ${
                  quicker === 'iqc' ? 'text-sky-800 font-600' : ''
                }`"
                @click="handleQuicker('iqc')"
              >
                IQC
              </li>
              <li
                :class="`cursor-pointer underline ${
                  quicker === 'pqc' ? 'text-sky-800 font-600' : ''
                }`"
                @click="handleQuicker('pqc')"
              >
                PQC
              </li>
              <li
                :class="`cursor-pointer underline ${
                  quicker === 'oqc' ? 'text-sky-800 font-600' : ''
                }`"
                @click="handleQuicker('oqc')"
              >
                OQC
              </li>
            </ul>
          </div>
          <Divider style="margin: 4px 0; font-size: 14px">Thời gian truy vấn</Divider>
        </Row>
      </div>
      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <div class="filter-buttons">
          <Button
            size="small"
            @click="setFilterType('day')"
            :type="filterType === 'day' ? 'primary' : 'default'"
            class="button"
            >Ngày
          </Button>
          <Button
            size="small"
            @click="setFilterType('week')"
            :type="filterType === 'week' ? 'primary' : 'default'"
            class="button"
            >Tuần
          </Button>
          <Button
            size="small"
            @click="setFilterType('month')"
            :type="filterType === 'month' ? 'primary' : 'default'"
            class="button"
            >Tháng
          </Button>
          <!-- <Button
            @click="setFilterType('year')"
            :type="filterType === 'year' ? 'primary' : 'default'"
            class="button"
            >Năm</Button
          > -->
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
        <Divider style="margin: 4px 0; font-size: 14px">Điều kiện truy vấn</Divider>
        <FormItem label="Lô sản xuất" name="batch_code" :hidden="quicker == 'iqc'">
          <Select
            v-model:value="formData.batch_code"
            placeholder="Vui lòng nhập"
            :options="batchCodeOptions"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>
        <FormItem label="Mã sản phẩm" name="product_id" :hidden="quicker == 'iqc'">
          <Select
            v-model:value="formData.product_id"
            placeholder="Vui lòng nhập"
            :options="productOptions"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>
        <FormItem label="Nguyên vật liệu" name="material_id" :hidden="quicker != 'iqc'">
          <Select
            v-model:value="formData.material_id"
            placeholder="Vui lòng nhập"
            :options="materialOptions"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>
        <FormItem label="Nhà cung cấp" name="supplier_id" :hidden="quicker != 'iqc'">
          <Select
            v-model:value="formData.supplier_id"
            placeholder="Vui lòng nhập"
            :options="supplierOptions"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>
        <FormItem label="Người kiểm tra" name="inspector_id">
          <Select
            v-model:value="formData.inspector_id"
            placeholder="Vui lòng nhập"
            :options="usersOptions"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>
        <FormItem label="Kết quả kiểm tra" name="result" :hidden="quicker == 'ddqc'">
          <Select
            v-model:value="formData.result"
            placeholder="Vui lòng chọn"
            :options="[
              { label: 'Tất cả', value: '' },
              { label: 'OK', value: 'OK' },
              { label: 'NG', value: 'NG' },
            ]"
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
  import {
    Button,
    Form,
    FormItem,
    RangePicker,
    Row,
    Select,
    Tree,
    Divider,
    Skeleton,
  } from 'ant-design-vue';
  import { DataNode } from 'ant-design-vue/lib/tree';
  import dayjs, { Dayjs } from 'dayjs';
  import { onUnmounted, ref, reactive, onMounted } from 'vue';
  import { ISelectOption } from '@/store/types/pagination';
  import ProductResource from '@/api/resource/ProductResource';
  import ProductionPlanResource from '@/api/resource/ProductionPlanResource';
  import UserResource from '@/api/resource/UserResource';
  import MaterialResource from '@/api/resource/MaterialResource';
  import SupplierResource from '@/api/resource/SupplierResource';
  import { cleanAndFormatData } from '@/utils/sidebar';

  const emit = defineEmits(['success', 'quicker']);
  const nodeTypeMap = new Map<string, 'process' | 'equipment'>();

  const processStore = useProcessStore();

  interface FormDataType {
    process: string | undefined;
    dates: [Dayjs, Dayjs] | undefined;
    batch_code: string | undefined;
    product_id: string | undefined;
    result: string | undefined;
    process_ids?: string[];
    equipment_ids?: string[];
    inspector_id?: string;
    material_id?: string;
    supplier_id?: string;
  }

  type FilterType = 'day' | 'week' | 'month';

  const formData = reactive<FormDataType>({
    process: undefined,
    dates: undefined,
    batch_code: undefined,
    product_id: undefined,
    result: undefined,
    process_ids: [],
    equipment_ids: [],
    inspector_id: undefined,
    material_id: undefined,
    supplier_id: undefined,
  });
  const treeData = ref<DataNode[]>([]);
  const checkedKeys = ref<any[]>([]);
  const quicker = ref<'ddqc' | 'iqc' | 'pqc' | 'oqc'>('ddqc');
  const productOptions = ref<ISelectOption[]>([]);
  const materialOptions = ref<ISelectOption[]>([]);
  const supplierOptions = ref<ISelectOption[]>([]);
  const usersOptions = ref<ISelectOption[]>([]);
  const batchCodeOptions = ref<ISelectOption[]>([]);
  const filterType = ref<FilterType>('day');

  function setFilterType(type: FilterType) {
    filterType.value = type;
  }

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    const [processResponse, productRes, userRes, batchRes, materialRes, supplierRes] =
      await Promise.allSettled([
        processStore.search(),
        ProductResource.getOptions(),
        UserResource.getOptions(),
        ProductionPlanResource.getBatchCodes(),
        MaterialResource.getOptions(),
        SupplierResource.getOptions(),
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

    if (productRes.status === 'fulfilled') {
      productOptions.value = productRes.value;
    }

    if (userRes.status === 'fulfilled') {
      usersOptions.value = userRes.value;
    }

    if (batchRes.status === 'fulfilled' && batchRes.value.success) {
      batchRes.value.data.forEach((item: string) => {
        batchCodeOptions.value.push({ label: item, value: item });
      });
    }

    if (materialRes.status === 'fulfilled') {
      materialOptions.value = materialRes.value;
    }

    if (supplierRes.status === 'fulfilled') {
      supplierOptions.value = supplierRes.value;
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
        140 -
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

  function handleQuicker(slug: 'ddqc' | 'iqc' | 'pqc' | 'oqc') {
    quicker.value = slug;
    emit('quicker', { quicker: slug, ...formData });
  }

  function handleSubmit() {
    const data = cleanAndFormatData(formData, filterType.value);
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
