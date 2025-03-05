import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const warehouse: AppRouteModule = {
  path: '/warehouse',
  name: 'WarehousePage',
  component: LAYOUT,
  redirect: '/warehouse/material',
  meta: {
    orderNo: 60,
    icon: 'tabler:building-warehouse',
    title: 'Kho',
  },
  children: [
    // {
    //   path: 'material',
    //   name: 'UIWarehouseMaterial',
    //   component: () => import('@/views/warehouse/material/WarehouseMaterial.vue'),
    //   meta: {
    //     // affix: true,
    //     title: 'Kho nguyên vật liệu',
    //   },
    // },
    // {
    //   path: 'finished-product',
    //   name: 'UIWarehouseFinishedProduct',
    //   component: () => import('@/views/warehouse/finished-product/WarehouseFinishedProduct.vue'),
    //   meta: {
    //     // affix: true,
    //     title: 'Kho thành phẩm',
    //   },
    // },
    // {
    //   path: 'semi-finished-product',
    //   name: 'UIWarehouseSemiFinishedProduct',
    //   component: () => import('@/views/warehouse/finished-product/WarehouseFinishedProduct.vue'), // Need fix
    //   meta: {
    //     // affix: true,
    //     title: 'Kho bán thành phẩm',
    //   },
    // },
    {
      path: 'import',
      name: 'UIWarehouseImport',
      component: () => import('@/views/warehouse/WarehouseImport.vue'),
      meta: {
        // affix: true,
        title: 'Lệnh nhập kho',
      },
    },
    {
      path: 'inventory',
      name: 'UIInventroyWarehouse',
      component: () => import('@/views/warehouse/Warehouse.vue'),
      meta: {
        // affix: true,
        title: 'Tồn kho',
      },
    },
    {
      path: 'export',
      name: 'UIWarehouseExport',
      component: () => import('@/views/warehouse/WarehouseExport.vue'),
      meta: {
        // affix: true,
        title: 'Lệnh xuất kho',
      },
    },
  ],
};

export default warehouse;
