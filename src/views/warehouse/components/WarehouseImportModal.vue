<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    style="top: 5px"
  >
    <!-- Form -->
    <Form ref="formItemRef" name="form_item" :model="itemForm" layout="vertical">
      <div class="w-full max-h-[450px] overflow-y-auto">
        <template v-for="(item, index) in itemForm.items" :key="item.key">
          <Row :gutter="5" class="w-[99%] mt-1 mb-1 border-b border-blue-700 border-dashed">
            <Col span="1">
              <FormItem :label="index === 0 ? 'STT' : ''">
                <div>{{ index + 1 }}</div>
              </FormItem>
            </Col>
            <Col span="21">
              <Row :gutter="5">
                <Col span="6">
                  <FormItem
                    :label="'Mã nguyên vật liệu'"
                    :name="['items', index, 'material_id']"
                    :rules="{
                      required: true,
                      message: 'Vui lòng nhập',
                      trigger: 'change',
                    }"
                  >
                    <Select
                      v-model:value="item.material_id"
                      placeholder="Nguyên vật liệu"
                      :options="materialOptions"
                      :show-search="true"
                      :filter-option="filterOption"
                      :allowClear="true"
                      :field-names="{ label: 'label', value: 'value' }"
                      @search="handleSearchMaterial"
                      @change="handleChangeMaterial"
                    />
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem
                    :label="'Nhà cung cấp'"
                    :name="['items', index, 'supplier_id']"
                    :rules="{
                      required: true,
                      message: 'Vui lòng nhập',
                      trigger: 'change',
                    }"
                  >
                    <Select
                      v-model:value="item.supplier_id"
                      placeholder="Nhà cung cấp"
                      :options="supplierOptions"
                      :show-search="true"
                      :dropdownMatchSelectWidth="false"
                      @search="handleSearchSupplier"
                    />
                  </FormItem>
                </Col>
                <Col span="3">
                  <FormItem
                    :label="'Số lượng'"
                    :name="['items', index, 'quantity_1']"
                    :rules="[
                      {
                        required: true,
                        message: 'Vui lòng nhập',
                        trigger: 'change',
                      },
                      { validator: (_, value) => validateTotalQuantity(index), trigger: 'change' },
                    ]"
                  >
                    <InputNumber
                      v-model:value="item.quantity_1"
                      placeholder="Số lượng"
                      @change="() => handleQuantityChange(index)"
                    />
                  </FormItem>
                </Col>
                <Col span="3">
                  <FormItem
                    :label="'ĐVT'"
                    :name="['items', index, 'unit_id_1']"
                    :rules="{
                      required: true,
                      message: 'Vui lòng nhập',
                      trigger: 'change',
                    }"
                  >
                    <Select
                      v-model:value="item.unit_id_1"
                      placeholder="Đơn vị tính"
                      :options="unitOptions"
                      :dropdownMatchSelectWidth="false"
                    />
                  </FormItem>
                </Col>
                <Col span="3">
                  <FormItem
                    :label="'Số PO'"
                    :name="['items', index, 'lot_no']"
                    :rules="{
                      required: true,
                      message: 'Vui lòng nhập',
                      trigger: 'change',
                    }"
                  >
                    <Input v-model:value="item.lot_no" placeholder="Số PO" />
                  </FormItem>
                </Col>
                <Col span="3">
                  <FormItem
                    :label="'SL Pallet'"
                    :name="['items', index, 'pallet_amount']"
                    :rules="{
                      required: true,
                      message: 'Vui lòng nhập',
                      trigger: 'change',
                    }"
                  >
                    <InputNumber
                      v-model:value="item.pallet_amount"
                      placeholder="SL Pallet"
                      :min="1"
                      @change="(value) => handlePalletAmountChange(Number(value), index)"
                    />
                  </FormItem>
                </Col>

                <!-- Pallets -->
                <Col span="24">
                  <template v-for="(itemPallet, indexPallet) in item.pallets" :key="itemPallet.key">
                    <Row :gutter="5">
                      <!-- <Col span="2">
                        <FormItem :label="indexPallet === 0 ? 'Thứ tự' : ''">
                          <div>{{ index + 1 }}.{{ indexPallet + 1 }}</div>
                        </FormItem>
                      </Col> -->
                      <Col span="6">
                        <FormItem
                          :label="indexPallet === 0 ? 'SL 1' : ''"
                          :name="['items', index, 'pallets', indexPallet, 'quantity_1']"
                          :rules="{
                            required: true,
                            message: 'Vui lòng nhập',
                            trigger: 'change',
                          }"
                        >
                          <InputNumber
                            v-model:value="itemPallet.quantity_1"
                            :min="0"
                            placeholder="SL 1"
                          />
                        </FormItem>
                      </Col>
                      <Col span="6">
                        <FormItem
                          :label="indexPallet === 0 ? 'ĐVT 1' : ''"
                          :name="['items', index, 'pallets', indexPallet, 'unit_id_1']"
                          :rules="{
                            required: true,
                            message: 'Vui lòng nhập',
                            trigger: 'change',
                          }"
                        >
                          <Select
                            v-model:value="itemPallet.unit_id_1"
                            placeholder="Đơn vị tính1"
                            :options="unitOptions"
                            :dropdownMatchSelectWidth="false"
                          />
                        </FormItem>
                      </Col>
                      <Col span="6">
                        <FormItem
                          :label="indexPallet === 0 ? 'SL 2' : ''"
                          :name="['items', index, 'pallets', indexPallet, 'quantity_2']"
                          :rules="{
                            required: true,
                            message: 'Vui lòng nhập',
                            trigger: 'change',
                          }"
                        >
                          <InputNumber
                            v-model:value="itemPallet.quantity_2"
                            :min="0"
                            placeholder="SL 2"
                          />
                        </FormItem>
                      </Col>
                      <Col span="6">
                        <FormItem
                          :label="indexPallet === 0 ? 'ĐVT 2' : ''"
                          :name="['items', index, 'pallets', indexPallet, 'unit_id_2']"
                          :rules="{
                            required: true,
                            message: 'Vui lòng nhập',
                            trigger: 'change',
                          }"
                        >
                          <Select
                            v-model:value="itemPallet.unit_id_2"
                            placeholder="Đơn vị tính2"
                            :options="unitOptions"
                            :dropdownMatchSelectWidth="false"
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </template>
                </Col>
              </Row>
            </Col>
            <Col span="2">
              <FormItem :label="' '">
                <Button block @click="() => removeItem(item)" :disabled="index === 0"
                  ><Icon icon="ant-design:close-outlined"
                /></Button>
              </FormItem>
            </Col>
          </Row>
        </template>
      </div>
      <FormItem class="mt-2">
        <!-- Add bom items -->
        <Button type="dashed" block @click="addItem"
          ><Icon icon="ant-design:plus-outlined" />Thêm nguyên vật liệu</Button
        >
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive, watch } from 'vue';
  import {
    Button,
    Col,
    Row,
    Form,
    FormItem,
    Select,
    message,
    InputNumber,
    Input,
  } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ISelectOption } from '@/store/types/pagination';
  import { searchMaterialApi } from '@/api/sys/material';
  import { searchSupplierApi } from '@/api/sys/supplier';
  import { searchUnitApi as searchUnit } from '@/api/sys/unit';
  import { createMaterialImportApi, updateMaterialImportApi } from '@/api/sys/warehouse';
  import { IMaterial } from '@/api/model/IMaterial';
  import { ISupplier } from '@/api/model/ISupplier';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import Icon from '@/components/Icon/Icon.vue';
  import { IUnit } from '@/api/model/IUnit';

  const emit = defineEmits(['success']);

  const record = ref<any>();
  const isUpdate = ref<boolean>(true);
  const isInitialized = ref<boolean>(false);
  const formItemRef = ref<FormInstance>();
  const itemForm = reactive<{
    items: {
      key: string;
      material_id: string;
      supplier_id: string;
      packing?: string;
      quantity_1: number;
      unit_id_1: number;
      pallet_amount: number;
      previous_pallet_amount: number;
      lot_no?: string;
      pallets: {
        key: string;
        quantity_1: number;
        unit_id_1: number;
        quantity_2: number;
        unit_id_2: number;
      }[];
    }[];
  }>({ items: [] });
  const materialOptions = ref<{ disabled: boolean; value: ''; label: '' }[]>([]);
  const supplierOptions = ref<ISelectOption[]>([]);
  const unitOptions = ref<ISelectOption[]>([]);
  const unitDefaultSelected = ref<number>(0);
  const unit2DefaultSelected = ref<number>(0);
  const timer = ref<any>();
  const disableMaterials = ref<any[]>([]);

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    isInitialized.value = false;
    await fetchMaterial();
    await fetchSupplier();
    await fetchUnit();
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      if (data.record?.items) {
        itemForm.items = data.record.items?.map(
          ({ material_id, supplier_id, packing, quantity_1, unit_id_1, pallets }) => ({
            material_id,
            supplier_id,
            packing,
            quantity_1: Number(quantity_1),
            unit_id_1,
            lot_no: pallets?.length > 0 ? pallets[0]?.lot_no : null,
            pallets: pallets?.map((item) => ({
              ...item,
              quantity_1: Number(item?.quantity_1),
              quantity_2: Number(item?.quantity_2),
            })),
            pallet_amount: pallets?.length || 1,
          }),
        );
        disableMaterials.value = data.record.items?.map(({ material_id }) => material_id);
        materialOptions.value = materialOptions.value.map((option) => ({
          ...option,
          disabled: disableMaterials.value.includes(option.value),
        }));
      } else {
        itemForm.items = [
          {
            key: dayjs().unix().toString(),
            material_id: '',
            supplier_id: '',
            packing: '',
            quantity_1: 0,
            unit_id_1: unitDefaultSelected.value,
            pallet_amount: 1,
            previous_pallet_amount: 1,
            lot_no: dayjs().format('DDMM'),
            pallets: [
              {
                key: dayjs().unix().toString(),
                quantity_1: 0,
                unit_id_1: unitDefaultSelected.value,
                quantity_2: 0,
                unit_id_2: unit2DefaultSelected.value,
              },
            ],
          },
        ];
      }
      setTimeout(() => {
        isInitialized.value = true;
      }, 300);
    } else {
      itemForm.items = [
        {
          key: dayjs().unix().toString(),
          material_id: '',
          supplier_id: '',
          packing: '',
          quantity_1: 0,
          unit_id_1: unitDefaultSelected.value,
          pallet_amount: 1,
          previous_pallet_amount: 1,
          lot_no: dayjs().format('DDMM'),
          pallets: [
            {
              key: dayjs().unix().toString(),
              quantity_1: 0,
              unit_id_1: unitDefaultSelected.value,
              quantity_2: 0,
              unit_id_2: unit2DefaultSelected.value,
            },
          ],
        },
      ];
      isInitialized.value = true;
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const materialItems: any = await formItemRef.value?.validate();
      if (!unref(isUpdate)) {
        // Force create
        const response: any = await createMaterialImportApi({
          material_items: materialItems.items,
        });
        if (response) {
          message.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else message.error('Thao tác thất bại');
      } else {
        // Force update
        const response: any = await updateMaterialImportApi({
          id: record.value?.id,
          material_items: materialItems.items,
        });
        if (response) {
          message.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else message.error('Thao tác thất bại');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  function addItem() {
    setTimeout(() => {
      itemForm.items.push({
        key: dayjs().unix().toString(),
        material_id: '',
        supplier_id: '',
        packing: '',
        quantity_1: 0,
        unit_id_1: unitDefaultSelected.value,
        pallet_amount: 1,
        previous_pallet_amount: 1,
        lot_no: dayjs().format('DDMM'),
        pallets: [
          {
            key: dayjs().unix().toString(),
            quantity_1: 0,
            unit_id_1: unitDefaultSelected.value,
            quantity_2: 0,
            unit_id_2: unit2DefaultSelected.value,
          },
        ],
      });
    }, 50);
  }

  function removeItem(item) {
    const index = itemForm.items.indexOf(item);
    if (index !== -1) {
      itemForm.items.splice(index, 1);
    }
  }

  const filterOption = (input, option) => {
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

  /**
   * @description get data material with params
   */
  async function fetchMaterial(params: any = {}) {
    if (!params?.page) params.page = 1;
    if (!params?.pageSize) params.pageSize = 20;
    const response: any = await searchMaterialApi(params);
    if (response?.data) {
      materialOptions.value = (response.data || []).map((item: IMaterial) => ({
        label: item.id,
        value: item.id,
      }));
    }
  }

  /**
   * @description get data supplier with params
   */
  async function fetchSupplier(params: any = {}) {
    if (!params?.page) params.page = 1;
    if (!params?.pageSize) params.pageSize = 20;
    const response: any = await searchSupplierApi(params);
    if (response?.data) {
      supplierOptions.value = (response.data || []).map((item: ISupplier) => ({
        label: item.name,
        value: item.id,
      }));
    }
  }

  /**
   * @description get data supplier with params
   */
  async function fetchUnit(params: any = {}) {
    // if (!params?.page) params.page = 1;
    // if (!params?.pageSize) params.pageSize = 20;
    params.page = null;
    params.pageSize = null;
    const response: any = await searchUnit(params);
    if (response?.data) {
      const resources: any[] = response.data || [];
      unitOptions.value = resources.map((item: IUnit) => ({
        label: item.name,
        value: item.id,
      }));
      if (resources.length > 0) {
        const getUnit: IUnit = resources?.find((item) => String(item.name).toLowerCase() === 'tờ');
        const getUnit2: IUnit = resources?.find((item) => String(item.name).toLowerCase() === 'kg');
        if (getUnit) unitDefaultSelected.value = getUnit.id;
        else unitDefaultSelected.value = resources[0]?.id;
        if (getUnit) unit2DefaultSelected.value = getUnit2.id;
        else unit2DefaultSelected.value = resources[0]?.id;
      }
    }
  }

  async function handleSearchMaterial(value: string | undefined) {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      if (value !== undefined) fetchMaterial({ id: value });
      else fetchMaterial();
      console.log(materialOptions.value);
    }, 500);
  }

  async function handleSearchSupplier(value: string | undefined) {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      fetchSupplier({ supplier_name: value });
    }, 500);
  }

  function handleChangeMaterial(value) {
    disableMaterials.value.push(value);
    const materialIds = itemForm.items.map((item) => item.material_id);
    if (materialIds.length > 0) {
      disableMaterials.value = disableMaterials.value.filter((option) =>
        materialIds?.includes(option),
      );
    }
    materialOptions.value = materialOptions.value.map((option) => ({
      ...option,
      disabled: disableMaterials.value.includes(option.value),
    }));
  }

  // Custom validation function
  function validateTotalQuantity(itemIndex: number) {
    // return Promise.resolve();
    if (!isInitialized.value) {
      return Promise.resolve();
    }

    const item = itemForm.items[itemIndex];
    const totalPalletQuantity = item.pallets.reduce((sum, pallet) => {
      return sum + (pallet.quantity_1 || 0);
    }, 0);

    if (item.quantity_1 === 0) {
      return Promise.reject(new Error('SL lớn hơn 0'));
    }

    if (totalPalletQuantity !== item.quantity_1) {
      return Promise.reject(new Error('Kiểm tra tổng SL1 Pallets'));
    } else {
      return Promise.resolve();
    }
  }

  // Update quantity_1 of pallets
  function updateQuantityPallets(itemIndex: number) {
    const item = itemForm.items[itemIndex];
    if (item.quantity_1 > 0 && item.pallets?.length > 0) {
      const each: number = parseInt(item.quantity_1 / item.pallet_amount);
      const remain: number = parseInt(item.quantity_1 % item.pallet_amount);
      item.pallets = item.pallets.map((row, index) => {
        if (index === item.pallets.length - 1) {
          return { ...row, quantity_1: each + remain };
        }
        return { ...row, quantity_1: each };
      });
    }
  }

  // Handle changes in pallet amount
  function handlePalletAmountChange(value: number, itemIndex: number) {
    const item = itemForm.items[itemIndex];
    const distance = value - (item.previous_pallet_amount || 1);

    if (distance === 1) {
      item.pallets.push({
        key: dayjs().unix().toString(),
        quantity_1: 0,
        unit_id_1: unitDefaultSelected.value,
        quantity_2: 0,
        unit_id_2: unit2DefaultSelected.value,
      });
      item.previous_pallet_amount = value;
    } else if (distance === -1) {
      if (item.pallets.length > 0) {
        item.pallets.pop();
        item.previous_pallet_amount = value;
      }
    } else {
      if (value > 0) {
        item.previous_pallet_amount = value;
        item.pallets = [];
        for (let i = 0; i < value; i++) {
          item.pallets.push({
            key: dayjs().unix().toString() + i, // Ensure unique keys
            quantity_1: 0,
            unit_id_1: unitDefaultSelected.value,
            quantity_2: 0,
            unit_id_2: unit2DefaultSelected.value,
          });
        }
      }
    }

    // Update quantity_1 of pallets
    updateQuantityPallets(itemIndex);

    // Re-validate the quantity_1 field
    formItemRef.value?.validateFields([['items', itemIndex, 'quantity_1']]);
  }

  // Handle changes in quantity_1
  function handleQuantityChange(itemIndex: number) {
    updateQuantityPallets(itemIndex);

    // Re-validate the quantity_1 field
    formItemRef.value?.validateFields([['items', itemIndex, 'quantity_1']]);
  }

  // Optional: Watch changes in pallets to trigger validation
  watch(
    () => itemForm.items.map((item) => item.pallets.map((pallet) => pallet.quantity_1)),
    () => {
      if (!isInitialized.value) return;

      itemForm.items.forEach((_, index) => {
        formItemRef.value?.validateFields([['items', index, 'quantity_1']]);
      });
    },
    { deep: true },
  );
</script>
