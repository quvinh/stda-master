<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    okText="Lưu lại"
    cancelText="Thoát"
  >
    <Form ref="formRef" :model="formData" layout="vertical" @submit="handleSubmit">
      <Row :gutter="[5, 5]">
        <Col :span="24">
          <FormItem
            label="Mã Quiz"
            name="id"
            :rules="[{ required: true, message: 'Vui lòng nhập' }]"
          >
            <Input v-model:value="formData.id" placeholder="Vui lòng nhập" />
          </FormItem>
          <FormItem
            label="Tên Quiz"
            name="title"
            :rules="[{ required: true, message: 'Vui lòng nhập' }]"
          >
            <Input v-model:value="formData.title" placeholder="Vui lòng nhập" />
          </FormItem>
          <FormItem
            label="Người tạo"
            name="created_by"
            :rules="[{ required: true, message: 'Vui lòng nhập' }]"
          >
            <Input v-model:value="formData.created_by" placeholder="Vui lòng nhập" />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import {
    Col,
    Form,
    FormItem,
    Input,
    Row,
    // Select,
  } from 'ant-design-vue';
  import { computed, reactive, ref, unref } from 'vue';

  const isUpdate = ref<boolean>(true);
  // const record = ref<any>({});
  const formRef = ref();
  // const emit = defineEmits(['success']);

  const formData = reactive<any>({
    title: null,
    id: null,
    created_by: null,
  });

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Thêm chức vụ' : 'Chỉnh sửa chức vụ'));

  async function handleSubmit() {
    const form = unref(formRef);
    const values = await form.validate();
    try {
      console.log(values);
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  .content-item {
    cursor: pointer;
  }

  .content-item:hover {
    background-color: rgb(134 195 245);
  }
</style>
