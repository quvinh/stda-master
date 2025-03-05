import type { AppRouteModule } from '@/router/types';

import { MODULE_LAYOUT } from '@/router/constant';

const overview: AppRouteModule = {
  path: '/overview',
  name: 'OverviewPage',
  component: MODULE_LAYOUT,
  redirect: '/overview/summary',
  meta: {
    orderNo: 80,
    icon: 'ant-design:line-chart-outlined',
    title: 'Dashboard',
    // hideMenu: true,
  },
  children: [
    {
      path: 'summary',
      name: 'OverviewSummary',
      component: () => import('@/views/overview/summary/OverviewSummary.vue'),
      meta: {
        title: 'Dashboard tổng hợp',
      },
    },
    {
      path: 'production',
      name: 'OverviewProduction',
      // component: () => import('@/views/overview/production/OverviewProduction.vue'),
      component: () => import('@/views/overview/production/OverviewFMB.vue'),
      meta: {
        title: 'Tình hình sản xuất',
      },
    },
    {
      path: 'equipment',
      name: 'OverviewEquipment',
      component: () => import('@/views/overview/equipment/OverviewEquipment.vue'),
      meta: {
        title: 'Thiết bị',
      },
    },
    {
      path: 'warehouse',
      name: 'OverviewWarehouse',
      component: () => import('@/views/overview/warehouse/OverviewWarehouse.vue'),
      meta: {
        title: 'Kho',
      },
    },
    {
      path: 'simulator',
      name: 'Simulator',
      component: () => import('@/views/overview/sketchfab/3DModel.vue'),
      meta: {
        title: 'Cảnh báo bất thường',
      },
    },
  ],
};

export default overview;
