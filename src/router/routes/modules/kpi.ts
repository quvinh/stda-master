import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const kpi: AppRouteModule = {
  path: '/kpi',
  name: 'KPIPage',
  component: LAYOUT,
  redirect: '/kpi',
  meta: {
    orderNo: 70,
    icon: 'tabler:chart-bar',
    title: 'KPI',
    hideChildrenInMenu: true,
  },
  children: [
    // {
    //   path: '',
    //   name: 'UIKPI',
    //   component: () => import('@/views/kpi/KPI.vue'),
    //   meta: {
    //     // affix: true,
    //     title: 'KPI',
    //   },
    // },
    {
      path: '',
      name: 'UIKPI',
      component: () => import('@/views/kpi/KPI2.vue'),
      meta: {
        // affix: true,
        title: 'KPI',
      },
    },
  ],
};

export default kpi;
