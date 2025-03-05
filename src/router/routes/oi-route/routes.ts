import type { AppRouteModule } from '@/router/types';

import { OI_LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const oiRoute: AppRouteModule = {
  path: '/oi',
  name: 'OIRoute',
  component: OI_LAYOUT,
  redirect: '/oi/production',
  meta: {
    type: 'oi',
    orderNo: 20,
    icon: 'ant-design:database-outlined',
    title: 'OI',
  },
  children: [
    {
      path: 'production',
      name: 'OIProduction',
      component: () => import('@/views/oi-views/production/OIProduction.vue'),
      meta: {
        title: t('routes.oi-routes.production'),
      },
    },
    {
      path: 'quality',
      name: 'OIQuality',
      component: () => import('@/views/oi-views/quality/OIQuality.vue'),
      meta: {
        title: 'QC Chất lượng',
      },
    },
    {
      path: 'quality-dd',
      name: 'OIQualityDD',
      component: () => import('@/views/oi-views/quality/OIQualityDD.vue'),
      meta: {
        title: 'QC Đầu Đơn',
      },
    },
    {
      path: 'quality-iqc',
      name: 'OIQualityIQC',
      component: () => import('@/views/oi-views/quality/OIQualityIQC.vue'),
      meta: {
        title: 'IQC',
      },
    },
    {
      path: 'quality-pqc',
      name: 'OIQualityPQC',
      component: () => import('@/views/oi-views/quality/OIQualityPQC.vue'),
      meta: {
        title: 'PQC',
      },
    },
    {
      path: 'quality-oqc',
      name: 'OIQualityOQC',
      component: () => import('@/views/oi-views/quality/OIQualityOQC.vue'),
      meta: {
        title: 'OQC',
      },
    },
    // {
    //   path: 'quality-oqc',
    //   name: 'OIQualityDD',
    //   component: () => import('@/views/oi-views/quality/OIQualityDD.vue'),
    //   meta: {
    //     title: 'QC Đầu Đơn',
    //   },
    // },
    {
      path: 'equipment',
      name: 'OIEquipment',
      component: () => import('@/views/oi-views/equipment/OIEquipment.vue'),
      meta: {
        title: 'Thiết bị',
      },
    },
    {
      path: 'warehouse',
      name: 'OIMaterialImport',
      component: () => import('@/views/oi-views/warehouse/material/OIMaterialImport.vue'),
      meta: {
        title: 'Nhập kho NVL',
      },
    },
    {
      path: 'warehouse/material-export',
      name: 'OIMaterialExport',
      component: () => import('@/views/oi-views/warehouse/material/OIMaterialExport.vue'),
      meta: {
        title: 'Xuất kho NVL',
      },
    },
    {
      path: 'warehouse/finished-product-import',
      name: 'OIFinishedProductImport',
      component: () =>
        import('@/views/oi-views/warehouse/finished-product/OIFinishedProductImport.vue'),
      meta: {
        title: 'Kho thành phẩm',
      },
    },
    {
      path: 'warehouse/finished-product-export',
      name: 'OIFinishedProductExport',
      component: () =>
        import('@/views/oi-views/warehouse/finished-product/OIFinishedProductExport.vue'),
      meta: {
        title: 'Kho thành phẩm',
      },
    },
    {
      path: 'warehouse/semi-finished-product-import',
      name: 'OISemiFinishedProductImport',
      component: () =>
        import('@/views/oi-views/warehouse/semi-finished-product/OISemiFinishedProductImport.vue'),
      meta: {
        title: 'Kho bán thành phẩm',
      },
    },
    {
      path: 'warehouse/semi-finished-product-export',
      name: 'OISemiFinishedProductExport',
      component: () =>
        import('@/views/oi-views/warehouse/semi-finished-product/OISemiFinishedProductExport.vue'),
      meta: {
        title: 'Kho bán thành phẩm',
      },
    },
    // Add here...
  ],
};

export default oiRoute;
