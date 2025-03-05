<template>
  <PageWrapper
    title="Sửa đổi mật khẩu người dùng hiện tại"
    content="Sau khi sửa đổi thành công, bạn sẽ tự động đăng xuất khỏi thông tin đăng nhập hiện tại！"
  >
    <div class="bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> Làm mới </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> Lưu thay đổi </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { BasicForm, useForm } from '@/components/Form';

  import { formSchema } from './form.data';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ref } from 'vue';

  defineOptions({ name: 'ChangePassword' });
  const { createMessage: msg } = useMessage();
  const userStore = useUserStore();
  const user = ref<any>({});

  const [register, { validate, resetFields }] = useForm({
    size: 'large',
    baseColProps: { span: 24 },
    labelWidth: 150,
    showActionButtonGroup: false,
    schemas: formSchema,
  });

  async function handleSubmit() {
    try {
      user.value = userStore.getUserInfo;
      const values = await validate();
      await userStore
        .update({
          ...user.value,
          currentPass: values.oldPass,
          password: values.newPass,
          id: user.value.id,
        })
        .then((res) => {
          if (res) {
            msg.success('Cập nhật mật khẩu thành công');
            userStore.logout();
          } else msg.error('Thao tác thất bại');
        })
        .catch((error) => {
          msg.error(error.message);
        });
    } catch (error) {
      console.error(error);
    }
  }
</script>
