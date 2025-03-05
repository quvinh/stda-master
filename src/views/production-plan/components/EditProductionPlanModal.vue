<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <!-- Form -->
    <Form ref="formItemRef" name="form_item" :model="itemForm" layout="vertical">
      <Row :gutter="[8, 8]">
        <Col span="12">
          <FormItem
            name="production_date"
            label="Ngày sản xuất"
            :rules="{
              required: true,
              message: 'Vui lòng nhập',
              trigger: 'change',
            }"
          >
            <DatePicker v-model="itemForm.date" :value="dayjs(itemForm.date)" class="w-full" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="Số lượng" name="quantity">
            <Input placeholder="Số lượng" v-model:value="itemForm.quantity" />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="[8, 8]">
        <Col span="12">
          <FormItem
            name="packaging_type"
            label="Loại bao bì"
            :rules="{
              required: true,
              message: 'Vui lòng nhập',
              trigger: 'change',
            }"
          >
            <Input placeholder="Loại bao bì" v-model:value="itemForm.packaging_type" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            label="Lot pallet"
            name="pallet_lot"
            :rules="{
              required: true,
              message: 'Vui lòng nhập',
              trigger: 'change',
            }"
          >
            <Input placeholder="Lot pallet" v-model:value="itemForm.pallet_lot" />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="[8, 8]">
        <Col span="12">
          <FormItem
            name="shipping"
            label="Màng co, shipping"
            :rules="{
              required: true,
              message: 'Vui lòng nhập',
              trigger: 'change',
            }"
          >
            <Input placeholder="Màng co, shipping" v-model:value="itemForm.shipping" />
          </FormItem>
        </Col>
        <Col span="12" class="pt-0.5">
          <FormItem label="Trạng thái" name="status">
            <Select
              placeholder="Chọn trạng thái"
              v-model:value="itemForm.status"
              :options="options"
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, reactive } from 'vue';
  import { Col, Row, Form, FormItem, Input, Select, message, DatePicker } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ISelectOption } from '@/store/types/pagination';
  import { searchMaterialApi } from '@/api/sys/material';
  import { updateApi } from '@/api/sys/equipment-maintenance-plan';
  import { IMaterial } from '@/api/model/IMaterial';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs from 'dayjs';

  const emit = defineEmits(['success']);

  const record = ref<any>();
  const isUpdate = ref<boolean>(true);
  const formItemRef = ref<FormInstance>();
  const options = ref<ISelectOption[]>([
    { value: '1', label: 'Đang chờ' },
    { value: '2', label: 'Đang thực hiện' },
    { value: '3', label: 'Hoàn thành' },
    { value: '4', label: 'Đã dừng' },
    { value: '5', label: 'Hủy' },
  ]);
  const itemForm = reactive<{
    date: string;
    quantity: string;
    packaging_type: string;
    pallet_lot: string;
    shipping: string;
    status: string;
  }>({ date: '', quantity: '', packaging_type: '', pallet_lot: '', shipping: '', status: '' });
  const materialOptions = ref<ISelectOption[]>([]);

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    await fetchMaterial();
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      console.log(record.value);
      itemForm.date = record.value.start_time;
      itemForm.quantity = record.value.quantity;
      itemForm.status = 'Đang chờ';
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = 'Chỉnh sửa thông tin đơn';

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const materialItems: any = await formItemRef.value?.validate();
      const formattedTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const response: any = await updateApi({
        explain: materialItems?.explain,
        notes: materialItems?.notes,
        id: record.value?.id,
        material_items: materialItems.items,
        end_time: formattedTime,
      });
      if (response) {
        message.success('Thao tác thành công');
        emit('success', {});
        closeModal();
      } else message.error('Thao tác thất bại');
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
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
</script>
