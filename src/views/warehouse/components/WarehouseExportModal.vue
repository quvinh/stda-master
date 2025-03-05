<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <!-- Form -->
    <Form ref="formItemRef" name="form_item" :model="itemForm" layout="vertical">
      <FormItem label="Ghi chú" name="note">
        <Input v-model:value="itemForm.note" />
      </FormItem>
      <template v-for="(item, index) in itemForm.items" :key="item.key">
        <Row :gutter="16">
          <Col span="10">
            <FormItem
              :label="index === 0 ? 'Mã nguyên vật liệu' : ''"
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
                :options="
                  materialOptions.map((row) => ({
                    ...row,
                    disabled: itemForm.items.find((item) => item.material_id === row.value)
                      ? true
                      : false,
                  }))
                "
                :show-search="true"
                option-filter-prop="label"
                @search="handleSearchMaterial"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              :label="index === 0 ? 'Số lượng' : ''"
              :name="['items', index, 'quantity']"
              :rules="{
                required: true,
                message: 'Vui lòng nhập',
                trigger: 'change',
              }"
            >
              <InputNumber v-model:value="item.quantity" :min="0" placeholder="Số lượng" />
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label="index === 0 ? ' ' : ''">
              <Button block @click="() => removeItem(item)" :disabled="index === 0"
                ><Icon icon="ant-design:close-outlined"
              /></Button>
            </FormItem>
          </Col>
        </Row>
      </template>
      <FormItem>
        <!-- Add bom items -->
        <Button type="dashed" block @click="addItem"
          ><Icon icon="ant-design:plus-outlined" />Thêm nguyên vật liệu</Button
        >
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import {
    Button,
    Col,
    Row,
    Form,
    FormItem,
    Input,
    Select,
    message,
    InputNumber,
  } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ISelectOption } from '@/store/types/pagination';
  import { searchMaterialApi } from '@/api/sys/material';
  import { searchApi as searchPallet } from '@/api/sys/pallet';
  import { createMaterialExportApi, updateMaterialExportApi } from '@/api/sys/warehouse';
  import { IMaterial } from '@/api/model/IMaterial';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import Icon from '@/components/Icon/Icon.vue';
  import { IPallet } from '@/api/model/IPallet';

  const emit = defineEmits(['success']);

  const record = ref<any>();
  const isUpdate = ref<boolean>(true);
  const formItemRef = ref<FormInstance>();
  const itemForm = reactive<{
    note: string;
    items: { key: string; material_id: string; quantity: string | number }[];
  }>({ note: '', items: [] });
  const materialOptions = ref<ISelectOption[]>([]);
  const timer = ref<any>();

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    // await fetchMaterial();
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      await fetchMaterial({ pageSize: 500 });
      record.value = data.record;
      itemForm.note = data.record.note;
      if (data.record?.items) {
        itemForm.items = data.record.items?.map(({ material_id, quantity }) => ({
          material_id,
          quantity,
        }));
      } else {
        itemForm.items = [{ key: dayjs().unix().toString(), material_id: '', quantity: '' }];
      }
    } else {
      await fetchMaterial();
      itemForm.items = [{ key: dayjs().unix().toString(), material_id: '', quantity: '' }];
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
        const response: any = await createMaterialExportApi({
          note: materialItems.note,
          material_items: materialItems.items,
        });
        if (response) {
          message.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else message.error('Thao tác thất bại');
      } else {
        // Force update
        const response: any = await updateMaterialExportApi({
          note: materialItems.note,
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
        quantity: '',
      });
    }, 50);
  }

  function removeItem(item) {
    const index = itemForm.items.indexOf(item);
    if (index !== -1) {
      itemForm.items.splice(index, 1);
    }
  }

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
   * @description get data material from pallet
   */
  async function fetchMaterialPallet(params: any = {}) {
    if (!params?.page) params.page = 1;
    if (!params?.pageSize) params.pageSize = 20;
    params.is_parent = true;
    const response: any = await searchPallet(params);
    if (response?.data) {
      materialOptions.value = (response.data || []).map((item: IPallet) => ({
        label: `${item.material_id} (${item.id})`,
        value: item.id,
        quantity_1: Number(item.quantity_1),
        disabled: item?.material_export_item ? true : false,
      }));
    }
  }

  async function handleSearchMaterial(value: string | undefined) {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      fetchMaterial({ id: value });
    }, 500);
  }
</script>
