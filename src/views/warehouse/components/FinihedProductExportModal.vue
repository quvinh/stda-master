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
              :label="index === 0 ? 'Mã thành phẩm' : ''"
              :name="['items', index, 'product_id']"
              :rules="{
                required: true,
                message: 'Vui lòng nhập',
                trigger: 'change',
              }"
            >
              <Select
                v-model:value="item.product_id"
                :options="
                  materialOptions.map((row) => ({
                    ...row,
                    disabled: itemForm.items.find((item) => item.product_id === row.value)
                      ? true
                      : false,
                  }))
                "
                :show-search="true"
                option-filter-prop="label"
                @search="handlesearchProduct"
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
          ><Icon icon="ant-design:plus-outlined" />Thêm thành phẩm</Button
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
  import { searchProductApi as searchProduct } from '@/api/sys/product';
  import {
    updateMaterialExportApi,
    createTPExportApi,
    updateTPExportApi,
  } from '@/api/sys/warehouse';
  import { IMaterial } from '@/api/model/IMaterial';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import Icon from '@/components/Icon/Icon.vue';

  const emit = defineEmits(['success']);

  const record = ref<any>();
  const isUpdate = ref<boolean>(true);
  const formItemRef = ref<FormInstance>();
  const itemForm = reactive<{
    note: string;
    items: { key: string; product_id: string; quantity: string | number }[];
  }>({ note: '', items: [] });
  const materialOptions = ref<ISelectOption[]>([]);
  const timer = ref<any>();

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    // await fetchProduct();
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      await fetchProduct({ pageSize: 500 });
      record.value = data.record;
      itemForm.note = data.record.note;
      if (data.record?.items) {
        itemForm.items = data.record.items?.map(({ product_id, quantity }) => ({
          product_id,
          quantity,
        }));
      } else {
        itemForm.items = [{ key: dayjs().unix().toString(), product_id: '', quantity: '' }];
      }
    } else {
      await fetchProduct();
      itemForm.items = [{ key: dayjs().unix().toString(), product_id: '', quantity: '' }];
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const materialItems: any = await formItemRef.value?.validate();
      const form = unref(formItemRef);
      console.log('value = ', form?.getFieldsValue());
      if (!unref(isUpdate)) {
        // Force create
        const response: any = await createTPExportApi({
          note: materialItems.note,
          product_items: materialItems.items,
        });
        if (response) {
          message.success('Thao tác thành công');
          emit('success', { type: 2 });
          closeModal();
        } else message.error('Thao tác thất bại');
      } else {
        // Force update
        const response: any = await updateTPExportApi({
          note: materialItems.note,
          id: record.value?.id,
          material_items: materialItems.items,
        });
        if (response) {
          message.success('Thao tác thành công');
          emit('success', { type: 2 });
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
        product_id: '',
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
  async function fetchProduct(params: any = {}) {
    if (!params?.page) params.page = 1;
    if (!params?.pageSize) params.pageSize = 20;
    const response: any = await searchProduct(params);
    if (response?.data) {
      materialOptions.value = (response.data || []).map((item: IMaterial) => ({
        label: item.id,
        value: item.id,
      }));
    }
  }

  async function handlesearchProduct(value: string | undefined) {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      fetchProduct({ id: value });
    }, 500);
  }
</script>
