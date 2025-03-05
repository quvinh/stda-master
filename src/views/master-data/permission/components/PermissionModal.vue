<template>
  <BasicModal @register="registerModal" :title="getTitle" @ok="handleSubmit" okText="Lưu lại">
    <Form ref="refForm" :model="formData">
      <Col :span="24">
        <FormItem
          label="Slug"
          name="slug"
          required
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
        >
          <Input v-model:value="formData.slug" placeholder="Slug" />
        </FormItem>
      </Col>
      <Col :span="24">
        <FormItem
          label="Tên quyền hạn"
          name="name"
          required
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
        >
          <Input v-model:value="formData.name" placeholder="Nhập tên quyền hạn" />
        </FormItem>
      </Col>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, reactive, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { Col, Form, FormItem, Input } from 'ant-design-vue';
  import { createPermissionApi, updatePermissionApi } from '@/api/sys/permission';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const isUpdate = ref<boolean>(true);
  const refForm = ref();
  const record = ref();
  const formData = reactive<any>({
    name: '',
    slug: '',
  });

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      formData.name = data.record?.name;
      formData.slug = data.record?.slug;
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Thêm quyền hạn' : 'Chỉnh sửa quyền hạn'));

  async function handleSubmit() {
    const form = unref(refForm);
    try {
      setModalProps({ loading: true, confirmLoading: true });
      if (!unref(isUpdate)) {
        // Force create
        const res: any = await createPermissionApi({ ...form.getFieldsValue() });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        // Force update
        const res: any = await updatePermissionApi({
          ...form.getFieldsValue(),
          id: record.value?.id ?? null,
        });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {}); // Emit success
          closeModal();
        } else msg.error('Thao tác thất bại');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>
