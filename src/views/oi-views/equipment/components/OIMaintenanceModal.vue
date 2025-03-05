<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <!-- Form -->
    <Form ref="formItemRef" name="form_item" :model="itemForm" layout="vertical">
      <FormItem label="Nội dung bảo dưỡng" name="notes">
        <Input placeholder="Nội dung bảo dưỡng" v-model:value="itemForm.notes" />
      </FormItem>
      <FormItem label="Giải thích" name="explain">
        <Input placeholder="Giải thích" v-model:value="itemForm.explain" />
      </FormItem>
      <template v-for="(item, index) in itemForm.items" :key="item.key">
        <Row :gutter="8">
          <Col span="14">
            <FormItem
              :label="index === 0 ? 'Tên phụ tùng' : ''"
              :name="['items', index, 'material_id']"
              :rules="{
                required: true,
                message: 'Vui lòng nhập',
                trigger: 'change',
              }"
            >
              <Select
                v-model:value="item.material_id"
                placeholder="Tên phụ tùng"
                :options="materialOptions"
                :show-search="true"
                @search="handleSearchMaterial"
              />
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem
              :label="index === 0 ? 'Số lượng' : ''"
              :name="['items', index, 'quantity']"
              required
            >
              <Input v-model:value="item.quantity" placeholder="Số lượng" />
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem :label="index === 0 ? ' ' : ''">
              <Button class="border border-color-red-500" block @click="() => removeItem(item)"
                ><Icon icon="ant-design:delete-outlined" class="text-red-500"
              /></Button>
            </FormItem>
          </Col>
        </Row>
      </template>
      <FormItem>
        <!-- Add bom items -->
        <Button type="dashed" block @click="addItem"
          ><Icon icon="ant-design:plus-outlined" />Thêm phụ tùng thay thế</Button
        >
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { Button, Col, Row, Form, FormItem, Input, Select, message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ISelectOption } from '@/store/types/pagination';
  import { searchMaterialApi } from '@/api/sys/material';
  import { updateApi } from '@/api/sys/equipment-maintenance-plan';
  import { IMaterial } from '@/api/model/IMaterial';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import Icon from '@/components/Icon/Icon.vue';

  const emit = defineEmits(['success']);

  const record = ref<any>();
  const isUpdate = ref<boolean>(true);
  const formItemRef = ref<FormInstance>();
  const itemForm = reactive<{
    notes: string;
    explain: string;
    items: { key: string; material_id: string; quantity: string }[];
  }>({ notes: '', explain: '', items: [] });
  const materialOptions = ref<ISelectOption[]>([]);
  const timer = ref<any>();

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    await fetchMaterial();
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

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
        itemForm.notes = '';
        itemForm.explain = '';
        itemForm.items = [];
        emit('success', {});
        closeModal();
      } else message.error('Thao tác thất bại');
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

  async function handleSearchMaterial(value: string | undefined) {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      fetchMaterial({ id: value });
    }, 500);
  }
</script>
