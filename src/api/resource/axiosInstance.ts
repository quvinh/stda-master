import axios from 'axios';
import { message } from 'ant-design-vue';
import { doLogout } from '@/api/sys/user';
import { getToken } from '@/utils/auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL + '/api',
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken() as string;
    if (token) {
      config.headers.Authorization = token;
      if (config.headers['Content-Type'] !== 'multipart/form-data') {
        config.headers['Content-Type'] = 'application/json'; //
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (
      response.data.message !== '' &&
      response.data.message !== 'success' &&
      response.data.message !== 'failed'
    ) {
      if (response.data.success) {
        message.success({ content: response.data.message });
      } else {
        message.error({ content: response.data.message });
      }
    }
    return response.data;
  },
  (error) => {
    switch (error.response?.status) {
      case 401:
        doLogout();
        break;

      default:
        break;
    }
    const defaultResponse = {
      data: [],
      success: false,
      message: 'Lỗi bất định !',
    };
    if (error?.response?.data?.message) {
      message.error({ content: error.response.data.message });
    } else {
      // message.error({ content: defaultResponse.message });
    }
    return Promise.resolve(defaultResponse);
  },
);

export default axiosInstance;
