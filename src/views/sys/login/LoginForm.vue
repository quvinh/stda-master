<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef" v-show="getShow"
    @keypress.enter="handleLogin">
    <FormItem name="email" class="enter-x">
      <Input size="large" v-model:value="formData.email" :placeholder="t('sys.login.userName')" class="fix-auto-fill" />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword size="large" visibilityToggle v-model:value="formData.password"
        :placeholder="t('sys.login.password')" />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        <Icon icon="ant-design:login-outlined" /> {{ t('sys.login.loginButton') }}
      </Button>
      <Button size="large" class="mt-4 enter-x" block @click="setLoginState(LoginStateEnum.REGISTER)">
        {{ t('sys.login.registerButton') }}
      </Button>
    </FormItem>
    <!-- <ARow class="enter-x" :gutter="[16, 16]">
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('sys.login.mobileSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('sys.login.qrSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('sys.login.registerButton') }}
        </Button>
      </ACol>
    </ARow> -->

    <!-- <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider> -->

    <!-- <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div> -->
  </Form>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, unref } from 'vue';

import { Button, Checkbox, Col, Form, Input, RadioButton, RadioGroup, Row } from 'ant-design-vue';
import LoginFormTitle from './LoginFormTitle.vue';

import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';

import Icon from '@/components/Icon/Icon.vue';
import { useDesign } from '@/hooks/web/useDesign';
import { useUserStore } from '@/store/modules/user';
// import { useRoute, useRouter } from 'vue-router';
import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';
//import { onKeyStroke } from '@vueuse/core';

const ACol = Col;
const ARow = Row;
const FormItem = Form.Item;
const InputPassword = Input.Password;
const { t } = useI18n();
const { notification, createErrorModal } = useMessage();
const { prefixCls } = useDesign('login');
const userStore = useUserStore();

const { setLoginState, getLoginState } = useLoginState();
const { getFormRules } = useFormRules();

const formRef = ref();
const loading = ref(false);
const rememberMe = ref(false);

const formData = reactive({
  email: '',
  password: '',
});

const { validForm } = useFormValid(formRef);

//onKeyStroke('Enter', handleLogin);

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

// const deviceType = ref<'desktop' | 'tablet' | 'ipad' | 'mobile'>('desktop');
// const router = useRouter();
// const route = useRoute();

onMounted(() => {
  updateDeviceType();
  window.addEventListener('resize', updateDeviceType);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDeviceType);
});

import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

async function handleLogin() {
  const data = await validForm();
  if (!data) return;

  try {
    loading.value = true;

    const response = await axios.post(import.meta.env.VITE_API_BASE_URL + '/login', {
      email: formData.email,
      password: formData.password,
    });

    // console.log(response); 

    localStorage.setItem('token', response.data.data.access_token);

    notification.success({
      message: t('sys.login.loginSuccessTitle'),
      description: `${t('sys.login.loginSuccessDesc')}`,
      duration: 3,
    });

    // Điều hướng đến dashboard
    // router.push('/dashboard');
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || 'Có lỗi xảy ra!';
    createErrorModal({
      title: t('sys.api.operationFailed'),
      content: msg,
      getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
    });
  } finally {
    loading.value = false;
  }
}

// async function handleLogin() {
//   const data = await validForm();
//   if (!data) return;
//   try {
//     loading.value = true;
//     const userInfo = await userStore.login({
//       password: data.password,
//       username: data.account,
//       layout: data.layout,
//       mode: 'none',
//     });
//     if (userInfo) {
//       notification.success({
//         message: t('sys.login.loginSuccessTitle'),
//         description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
//         duration: 3,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     const msg = (error as any)?.response?.data?.message || (error as unknown as Error).message;
//     createErrorModal({
//       title: t('sys.api.operationFailed'),
//       content: msg || t('sys.api.networkExceptionMsg'),
//       getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
//     });
//   } finally {
//     loading.value = false;
//   }
// }

/**
 * Detect device type
 */
// function detectDeviceType(): 'desktop' | 'tablet' | 'ipad' | 'mobile' {
//   const userAgent = navigator.userAgent.toLowerCase();

//   if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent)) {
//     return 'mobile';
//   } else if (/ipad/.test(userAgent)) {
//     return 'ipad';
//   } else if (/tablet|playbook|silk/.test(userAgent)) {
//     return 'tablet';
//   } else {
//     return 'desktop';
//   }
// }

function updateDeviceType() {
  // const width = window.innerWidth;
  // if (width <= 600) {
  //   deviceType.value = 'mobile';
  //   formData.layout = 'oi';
  // } else if (width > 600 && width <= 1024) {
  //   deviceType.value = 'tablet';
  //   formData.layout = 'oi';
  // } else {
  //   deviceType.value = 'desktop';
  //   formData.layout = 'ui';
  // }
  // deviceType.value = detectDeviceType();
  // switch (deviceType.value) {
  //   case 'desktop':
  //     formData.layout = 'ui';
  //     router.push({
  //       path: route.path,
  //       query: { ...route.query, redirect: '/dashboard' },
  //     });
  //     break;
  //   default:
  //     formData.layout = 'oi';
  //     router.push({
  //       path: route.path,
  //       query: { ...route.query, redirect: '/oi' },
  //     });
  //     break;
  // }
  // console.log(`detect device: ${deviceType.value} ✨`);
}

// function handleLayoutChange(e) {
//   switch (e.target.value) {
//     case 'ui':
//       router.push({
//         path: route.path,
//         query: { ...route.query, redirect: '/dashboard' },
//       });
//       break;
//     case 'oi':
//       router.push({
//         path: route.path,
//         query: { ...route.query, redirect: '/oi' },
//       });
//       break;
//     default:
//       break;
//   }
// }
</script>
