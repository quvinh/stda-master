<template>
  <div v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem
        name="name"
        class="enter-x"
        :rules="[{ required: true, message: 'Vui lòng nhập họ tên!' }]"
      >
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.name"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>
      <FormItem
        name="email"
        class="enter-x"
        :rules="[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Không đúng định dạng email!' },
        ]"
      >
        <Input
          class="fix-auto-fill"
          size="large"
          type="email"
          v-model:value="formData.email"
          :placeholder="'Email'"
        />
      </FormItem>
      <FormItem
        name="username"
        class="enter-x"
        :rules="[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]"
      >
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.username"
          :placeholder="'Tên đăng nhập'"
        />
      </FormItem>
      <!-- <FormItem name="mobile" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.sms"
          :placeholder="t('sys.login.smsCode')"
        />
      </FormItem> -->
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="password_confirmation" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.password_confirmation"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <!-- <FormItem class="enter-x" name="policy">
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem> -->

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </div>
</template>
<script lang="ts" setup>
  import { StrengthMeter } from '@/components/StrengthMeter';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useUserStore } from '@/store/modules/user';
  import { Button, Form, Input } from 'ant-design-vue';
  import { computed, reactive, ref, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const userStore = useUserStore();
  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    username: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    policy: true,
    role: 'user',
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  async function handleRegister() {
    const data = await validForm();
    if (!data) return;
    console.log(data);
    const result = await userStore.register(data);
    if (result) {
      handleBackLogin();
    }
  }
</script>
