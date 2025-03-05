import type { AppRouteModule } from '@/router/types';

import { getParentLayout, LAYOUT } from '@/router/constant';

const production: AppRouteModule = {
  path: '/production',
  name: 'ProductionPage',
  component: LAYOUT,
  redirect: '/production/plan',
  meta: {
    orderNo: 30,
    icon: 'ion:file-tray-stacked-outline',
    title: 'Sản xuất',
  },
  children: [
    {
      path: 'plan',
      name: 'UIProduction',
      component: () => import('@/views/production-plan/ProductionPlan.vue'),
      // component: () =>
      //   import('@/views/production-plan/components/drag/ProductionPlanDraggable.vue'),
      meta: {
        // affix: true,
        title: 'Kế hoạch sản xuất',
      },
    },
    {
      path: 'history',
      name: 'UIManufactureHistory',
      component: () => import('@/views/production-plan/ManufactureHistory.vue'),
      meta: {
        // affix: true,
        title: 'Lịch sử sản xuất',
      },
    },
    {
      path: 'ct_tt',
      name: 'UICT_TTManagement',
      component: () => import('@/views/production-plan/CT_TTManagement.vue'),
      meta: {
        // affix: true,
        title: 'Quản lý CT, TT',
        hideMenu: true,
      },
    },
    {
      path: 'product-order',
      name: 'ProductOrder',
      component: getParentLayout('ProductOrder'),
      redirect: '/production/product-order/list',
      meta: {
        // affix: true,
        title: 'Đơn hàng',
      },
      children: [
        {
          path: 'list',
          name: 'ProductOrderList',
          component: () => import('@/views/production-plan/ProductOrder.vue'),
          meta: {
            title: 'Danh sách đơn hàng',
          },
        },
        {
          path: 'process',
          name: 'ProductOrderProcess',
          component: () => import('@/views/production-plan/ProductOrderProcess.vue'),
          meta: {
            title: 'Tiến độ thực hiện đơn hàng',
          },
        },
      ],
    },
    // {
    //   path: 'production-capacity',
    //   name: 'ProductionCapacity',
    //   component: () => import('@/views/production-plan/ProductionCapacity.vue'),
    //   meta: {
    //     // affix: true,
    //     title: 'Năng lực sản xuất',
    //   },
    // },
    {
      path: 'load-factor',
      name: 'LoadFactor',
      component: () => import('@/views/production-plan/LoadFactor.vue'),
      meta: {
        // affix: true,
        title: 'Hệ số tải',
      },
    },
    {
      path: 'scheduler',
      name: 'Scheduler',
      component: () => import('@/views/overview/scheduler/VScheduler.vue'),
      meta: {
        title: 'Scheduler',
        hideMenu: true,
      },
    },
  ],
};

export default production;
