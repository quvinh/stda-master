import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const IFrame = () => import('@/views/sys/iframe/FrameBlank.vue');

const report: AppRouteModule = {
  path: '/report',
  name: 'Report',
  component: LAYOUT,
  redirect: '/report',
  meta: {
    orderNo: 90,
    icon: 'ant-design:file-ppt-outlined',
    title: t('routes.report.report'),
    // hideChildrenInMenu: true,
    hideMenu: true,
  },
  children: [
    {
      path: 'ppt',
      name: t('routes.report.pptReport'),
      component: IFrame,
      meta: {
        // frameSrc: 'https://pptist.vnq.io.vn',
        frameSrc: 'https://pptist.netlify.app',
        title: t('routes.report.pptReport'),
      },
    },
  ],
};

export default report;
