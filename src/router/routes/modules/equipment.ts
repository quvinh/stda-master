import type { AppRouteModule } from '@/router/types';

import { getParentLayout, LAYOUT } from '@/router/constant';

const equipment: AppRouteModule = {
  path: '/equipment',
  name: 'EquipmentPage',
  component: LAYOUT,
  redirect: '/equipment/performance',
  meta: {
    orderNo: 50,
    icon: 'tabler:archive',
    title: 'Thiết bị',
  },
  children: [
    {
      path: 'performance',
      name: 'UIEquipmentPerformance',
      component: () => import('@/views/equipment/EquipmentPerformance.vue'),
      meta: {
        // affix: true,
        title: 'Hiệu suất thiết bị',
      },
    },
    {
      path: 'parameter',
      name: 'UIEquipmentParameter',
      component: () => import('@/views/equipment/EquipmentParameter.vue'),
      meta: {
        // affix: true,
        title: 'Thông số thiết bị',
      },
    },
    {
      path: 'maintenance',
      name: 'UIMaintenance',
      component: getParentLayout('Maintenance'),
      redirect: '/master-data/maintenance/plan',
      meta: {
        title: 'Bảo trì, bảo dưỡng',
      },
      children: [
        {
          path: 'plan',
          name: 'UIEquipmentMaintenancePlan',
          component: () => import('@/views/equipment/EquipmentMaintenancePlanClone.vue'),
          meta: {
            title: 'Kế hoạch bảo dưỡng thiết bị',
          },
        },
        // {
        //   path: 'history',
        //   name: 'UIEquipmentMaintenanceHistory',
        //   component: () => import('@/views/equipment/EquipmentMaintenanceHistory.vue'),
        //   meta: {
        //     title: 'Lịch sử bảo dưỡng thiết bị',
        //   },
        // },
        {
          path: 'detail',
          name: 'UIDetailMaintenance',
          component: () => import('@/views/equipment/DetailMaintenance.vue'),
          meta: {
            title: 'Chi tiết thực hiện kiểm tra',
          },
        },
      ],
    },
    {
      path: 'mold',
      name: 'UIMold',
      component: () => import('@/views/equipment/Mold.vue'),
      meta: {
        // affix: true,
        title: 'Khuôn',
      },
    },
    {
      path: 'electricityConsumption',
      name: 'UIElectricityConsumption',
      component: () => import('@/views/equipment/ElectricityConsumption.vue'),
      meta: {
        // affix: true,
        title: 'Điện năng tiêu thụ',
        hideMenu: true,
      },
    },
  ],
};

export default equipment;
