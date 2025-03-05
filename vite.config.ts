import { defineApplicationConfig } from '@vben/vite-config';
import { loadEnv } from 'vite';

function apiTarget(): string {
  const root = process.cwd();
  const { VITE_BACKEND_URL } = loadEnv('development', root);
  return VITE_BACKEND_URL || 'http://127.0.0.1:8000';
}

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/en_US',
        'three',
        '@infectoone/vue-ganttastic',
      ],
    },
    server: {
      proxy: {
        '/v1': {
          target: apiTarget(),
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/v1`), 'api/v1'),
          // only https
          // secure: false
        },
        '/sample-file': {
          target: apiTarget(),
          changeOrigin: true,
          ws: false,
          rewrite: (path) => path.replace(new RegExp(`^/sample-file`), ''),
        },
      },
      open: true,
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
  },
});
