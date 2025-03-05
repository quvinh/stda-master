<template>
  <PageWrapper title="Sửa đổi thông tin tài khoản">
    <div class="bg-white flex flex-col justify-center items-center">
      <Form
        class="w-full"
        ref="formRef"
        :model="formData"
        :label-col="{ style: { width: '150px' } }"
        @keypress.enter="handleSubmit"
        @submit="handleSubmit"
      >
        <FormItem label="Ảnh đại diện" name="photo">
          <Upload
            accept="image/png"
            :showUploadList="false"
            :loading="uploading"
            list-type="picture-card"
            :before-upload="beforeUpload"
            v-model:file-list="formData.list"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="photo" class="w-full max-h-full" />
            <div v-else>
              <LoadingOutlined v-if="uploading" />
              <PlusOutlined v-else />
              <div class="ant-upload-text">Upload</div>
            </div>
          </Upload>
        </FormItem>
        <FormItem
          label="Họ và tên"
          name="name"
          :rules="[{ required: true, message: 'Vui lòng nhập' }]"
        >
          <Input placeholder="Họ và tên" v-model:value="formData.name" />
        </FormItem>
        <FormItem
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Vui lòng nhập' }, { type: 'email' }]"
        >
          <Input placeholder="Email" v-model:value="formData.email" />
        </FormItem>
      </Form>
      <div class="flex justify-center">
        <!-- <a-button @click="resetFields"> Làm mới </a-button> -->
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> Lưu thay đổi </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { updateUserInfoApi } from '@/api/sys/user';
  import { PageWrapper } from '@/components/Page';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useUserStore } from '@/store/modules/user';
  import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { Form, FormItem, Input, Upload } from 'ant-design-vue';
  import { onMounted, reactive, ref, unref } from 'vue';

  defineOptions({ name: 'ChangePassword' });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const userStore = useUserStore();
  const { createMessage: msg } = useMessage();
  const uploading = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const userInfo = ref<any>({});
  const imageUrl = ref<string>('');
  const formRef = ref<any>();
  const formData = reactive<any>({
    id: null,
    phone_number: null,
    name: null,
    list: null,
    email: null,
    address: null,
  });

  onMounted(() => {
    const { name = '', photo, email, id } = userStore.getUserInfo || {};
    formData.name = name;
    formData.email = email;
    formData.id = id;
    if (photo) imageUrl.value = `${BACKEND_URL}/media/${photo}`;
  });

  async function handleSubmit() {
    try {
      loading.value = true;
      const form = unref(formRef);
      form?.validate();
      if (formData.list && formData.list[0]) {
        formData.photo = formData.list[0];
        delete formData.list;
      }
      await updateUserInfoApi(formData)
        .then(async (res) => {
          if (res) {
            await userStore.getUser();
            msg.success('Thao tác thành công');
          } else msg.error('Thao tác thất bại');
        })
        .catch((error) => {
          msg.error(error.message);
        });
    } catch (error) {
      console.error(error);
    }
  }

  function beforeUpload() {
    // formData.list = [...formData.list, file];
    return false;
  }

  function getBase64(img: Blob, callback: (base64Url: string) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  }

  function handleChange(info: any) {
    if (info?.file) {
      formData.list = [info.file];
      getBase64(info.file, (base64Url: string) => {
        imageUrl.value = base64Url;
        uploading.value = false;
      });
    }
  }
</script>
