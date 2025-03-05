import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/info',
  meta: {
    orderNo: 200,
    icon: 'ant-design:setting-outlined',
    title: t('routes.config.system'),
  },
  children: [
    {
      path: 'info',
      name: t('routes.config.config'),
      component: () => import('@/views/config/Config.vue'),
      meta: {
        title: t('routes.config.config'),
        // hideMenu: true,
      },
    },
    // {
    //   path: 'design',
    //   name: t('routes.config.design'),
    //   component: () => import('@/views/form-design/index.vue'),
    //   meta: {
    //     title: t('routes.config.design'),
    //   },
    // },
    // {
    //   path: 'design',
    //   name: t('routes.config.design'),
    //   component: () => import('@/views/config/draggable/Draggable.vue'),
    //   meta: {
    //     title: t('routes.config.design'),
    //   },
    // },
    // {
    //   path: 'three',
    //   name: 'Three',
    //   component: () => import('@/components/ThreeJS/ModelViewer.vue'),
    //   meta: {
    //     title: 'Three',
    //   },
    // },
    {
      path: 'ws',
      name: 'WebSocket',
      component: () => import('@/views/sys/websocket/index.vue'),
      meta: {
        // affix: true,
        title: 'WebSocket',
      },
    },
    {
      path: 'eav',
      name: 'EAV',
      component: () => import('@/views/sys/eav/index.vue'),
      meta: {
        // affix: true,
        title: 'EAV',
      },
    },
    {
      path: 'application-settings',
      name: 'ApplicationSetting',
      component: () => import('@/views/sys/application-setting/index.vue'),
      meta: {
        // affix: true,
        title: 'QL cấu hình',
      },
    },
  ],
};

export default system;
