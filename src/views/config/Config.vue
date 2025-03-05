<template>
  <Card class="h-full bg-white" title="Cấu hình hệ thống" size="small">
    <Form
      ref="formRef"
      :model="formData"
      :label-col="{ style: { width: '150px' } }"
      @keypress.enter="handleSubmit"
      @submit="handleSubmit"
    >
      <FormItem
        label="Tên công ty"
        name="name"
        :rules="[{ required: true, message: 'Vui lòng nhập' }]"
      >
        <Input placeholder="Tên công ty" v-model:value="formData.name" />
      </FormItem>
      <FormItem
        label="ID mô hình nhà máy"
        name="factory_model"
        :rules="[{ required: true, message: 'Vui lòng nhập' }]"
      >
        <Input placeholder="Factory model" v-model:value="formData.factory_model" />
      </FormItem>
      <FormItem label="Logo" name="logo">
        <Upload
          accept="image/png"
          :showUploadList="false"
          :loading="uploading"
          list-type="picture-card"
          :before-upload="beforeUpload"
          v-model:file-list="formData.list"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="logo" class="w-full max-h-full" />
          <div v-else>
            <LoadingOutlined v-if="uploading" />
            <PlusOutlined v-else />
            <div class="ant-upload-text">Upload</div>
          </div>
        </Upload>
      </FormItem>
      <Form.Item class="text-right">
        <Button type="primary" htmlType="submit"
          ><Icon icon="ant-design:save-outlined" /> Submit
        </Button>
      </Form.Item>
    </Form>
  </Card>
</template>

<script setup lang="ts">
  import { getConfigApi, updateConfigApi } from '@/api/sys/config';
  import Icon from '@/components/Icon/Icon.vue';
  import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import {
    Button,
    Card,
    Form,
    FormItem,
    Input,
    message,
    Upload,
    UploadChangeParam,
  } from 'ant-design-vue';
  import { onMounted, reactive, ref, unref } from 'vue';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const formRef = ref();
  const formData = reactive<any>({
    name: null,
    logo: null,
    factory_model: null,
    list: [],
  });
  const uploading = ref<boolean>(false);
  const imageUrl = ref<string>('');
  const isReload = ref<boolean>(false);

  onMounted(() => {
    fetchData();
  });

  async function handleSubmit() {
    const form = unref(formRef);
    form?.validate();

    if (formData.name) {
      if (formData.list && formData.list[0]) {
        isReload.value = true;
        formData.logo = formData.list[0];
        delete formData.list;
      }
      const response = await updateConfigApi({ ...formData });
      if (response) {
        message.success('Thao tác thành công');
        if (isReload.value) {
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else fetchData();
      } else {
        message.error('Thao tác thất bại');
      }
    }
  }

  function getBase64(img: Blob, callback: (base64Url: string) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  }

  function beforeUpload() {
    // formData.list = [...formData.list, file];
    return false;
  }

  function handleChange(info: UploadChangeParam | any) {
    if (info?.file) {
      formData.list = [info.file];
      getBase64(info.file, (base64Url: string) => {
        imageUrl.value = base64Url;
        uploading.value = false;
      });
    }
  }

  async function fetchData() {
    isReload.value = false;
    const response: any = await getConfigApi();
    if (response?.id) {
      formData.name = response.options?.name ?? 'Tên công ty';
      formData.factory_model = response.options?.factory_model;
      imageUrl.value = `${BACKEND_URL}/logo`;
    }
  }
</script>
