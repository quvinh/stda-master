import 'uno.css';
import '@/design/index.less';
import '@/components/VxeTable/src/css/index.scss';
import 'ant-design-vue/dist/reset.css';
// Register icon sprite
import 'virtual:svg-icons-register';

import { createApp } from 'vue';
// import { Form } from 'ant-design-vue';
import { registerGlobComp } from '@/components/registerGlobComp';
import { setupGlobDirectives } from '@/directives';
import { setupI18n } from '@/locales/setupI18n';
import { setupErrorHandle } from '@/logics/error-handle';
import { initAppConfigStore } from '@/logics/initAppConfig';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { setupStore } from '@/store';
// import ganttastic from '@infectoone/vue-ganttastic';
import Particles from '@tsparticles/vue3';
import { loadSlim } from '@tsparticles/slim';
import App from './App.vue';

window.global ||= window;

async function bootstrap() {
  const app = createApp(App);
  // Configure store
  setupStore(app);

  // Initialize internal system configuration
  initAppConfigStore();

  // Register global components
  registerGlobComp(app);

  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app);

  // Configure routing
  setupRouter(app);

  // router-guard
  setupRouterGuard(router);

  // Register global directive
  setupGlobDirectives(app);

  // Configure global error handling
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();
  // app.use(ganttastic);
  app.use(Particles, {
    init: async (engine) => {
      // await loadFull(engine) // Dùng nếu bạn cài `tsparticles` (bản full)
      await loadSlim(engine); // Dùng nếu bạn cài `@tsparticles/slim` (bản gọn)
    },
  });

  app.mount('#app');
}

bootstrap();
