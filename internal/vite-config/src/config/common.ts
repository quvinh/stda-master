import UnoCSS from 'unocss/vite';
import { type UserConfig } from 'vite';

const commonConfig: (mode: string) => UserConfig = (mode) => ({
  server: {
    host: true,
    // proxy: {
    //   '/v1': {
    //     target: 'http://127.0.0.1:8000',
    //   },
    // },
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // TODO: Prevent memory overflow
      maxParallelFileOps: 3,
    },
  },
  plugins: [UnoCSS()],
});

export { commonConfig };
