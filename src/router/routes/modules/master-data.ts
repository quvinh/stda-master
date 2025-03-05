import type { AppRouteModule } from '@/router/types';

import { getParentLayout, LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { PermissionEnum } from '@/enums/permissionEnum';

const masterData: AppRouteModule = {
  path: '/master-data',
  name: 'MasterData',
  component: LAYOUT,
  redirect: '/master-data/customer',
  meta: {
    orderNo: 20,
    icon: 'ant-design:database-outlined',
    title: t('routes.master-data.base'),
  },
  children: [
    {
      path: 'customer',
      name: 'Customer',
      component: () => import('@/views/master-data/customer/index.vue'),
      meta: {
        title: t('routes.master-data.customer'),
        permissions: [PermissionEnum.CUSTOMER_SEARCH],
      },
    },
    {
      path: 'department',
      name: 'Department',
      component: () => import('@/views/master-data/department/index.vue'),
      meta: {
        title: t('routes.master-data.department'),
      },
    },
    {
      path: 'unit',
      name: 'Unit',
      component: () => import('@/views/master-data/unit/index.vue'),
      meta: {
        title: t('routes.master-data.unit'),
      },
    },
    // {
    //   path: 'order',
    //   name: 'Order',
    //   component: () => import('@/views/master-data/productOrder/index.vue'),
    //   meta: {
    //     title: 'Quản lý đơn hàng',
    //   },
    // },
    {
      path: 'products',
      name: 'Products',
      component: getParentLayout('Products'),
      redirect: '/master-data/products/index',
      meta: {
        title: t('routes.master-data.product'),
      },
      children: [
        {
          path: 'category',
          name: 'ProductCategory',
          component: () => import('@/views/master-data/productCategory/index.vue'),
          meta: {
            title: 'Loại sản phẩm',
          },
        },
        {
          path: 'index',
          name: 'ProductPage',
          component: () => import('@/views/master-data/product/index.vue'),
          meta: {
            title: 'Sản phẩm',
          },
        },

        {
          path: 'spec',
          name: 'SpecPage',
          component: () => import('@/views/master-data/spec/index.vue'),
          meta: {
            title: 'Thông tin sản phẩm (Spec)',
          },
        },
      ],
    },
    {
      path: 'suppliers',
      name: 'Suppliers',
      component: () => import('@/views/master-data/supplier/index.vue'),
      meta: {
        title: t('routes.master-data.supplier'),
      },
    },
    {
      path: 'materials',
      name: 'Materials',
      component: getParentLayout('Materials'),
      meta: {
        title: t('routes.master-data.materials'),
      },
      children: [
        {
          path: 'category',
          name: 'MaterialCategory',
          component: () => import('@/views/master-data/materialCategory/index.vue'),
          meta: {
            title: 'Loại nguyên vật liệu',
          },
        },
        {
          path: 'index',
          name: 'MaterialPage',
          component: () => import('@/views/master-data/material/index.vue'),
          meta: {
            title: 'Nguyên vật liệu',
          },
        },
      ],
    },
    {
      path: 'semi-finished-product',
      name: 'SemiFinishedProduct',
      component: () => import('@/views/master-data/semi_finished_product/index.vue'),
      meta: {
        title: 'QL bán thành phẩm',
      },
    },
    {
      path: 'molds',
      name: 'molds',
      component: () => import('@/views/master-data/mold/index.vue'),
      meta: {
        title: 'QL khuôn',
      },
    },
    {
      path: 'warehouses',
      name: 'Warehouses',
      component: getParentLayout('Warehouses'),
      redirect: '/master-data/warehouses/index',
      meta: {
        title: t('routes.master-data.warehouses'),
      },
      children: [
        {
          path: 'index',
          name: 'WarehousesIndex',
          component: () => import('@/views/master-data/warehouse/index.vue'),
          meta: {
            title: 'Kho',
          },
        },
        {
          path: 'locations',
          name: 'WarehouseLocations',
          component: () => import('@/views/master-data/warehouseLocation/index.vue'),
          meta: {
            title: 'Vị trí kho',
          },
        },
      ],
    },
    {
      path: 'processes',
      name: 'Processes',
      component: getParentLayout('Processes'),
      redirect: '/master-data/processes/index',
      meta: {
        title: t('routes.master-data.processes'),
      },
      children: [
        {
          path: 'index',
          name: 'ProcessesIndex',
          component: () => import('@/views/master-data/process/index.vue'),
          meta: {
            title: 'Công đoạn',
          },
        },
        {
          path: 'error-qualities',
          name: 'ErrorQualities',
          component: () => import('@/views/master-data/errorQuality/index.vue'),
          meta: {
            title: 'Lỗi công đoạn',
          },
        },
      ],
    },
    {
      path: 'boms',
      name: 'Boms',
      component: () => import('@/views/master-data/boms/index.vue'),
      meta: {
        title: t('routes.master-data.boms'),
      },
    },
    // {
    //   path: 'acceptance-quality-limit',
    //   name: 'AcceptanceQualityLimit',
    //   component: () => import('@/views/master-data/acceptanceQualityLimit/index.vue'),
    //   meta: {
    //     title: t('routes.master-data.acceptance-quality-limit'),
    //   },
    // },
    {
      path: 'equipment',
      name: 'Equipment',
      component: getParentLayout('Equipment'),
      redirect: '/master-data/equipment/index',
      meta: {
        title: t('routes.master-data.equipment'),
      },
      children: [
        {
          path: 'index',
          name: 'EquipmentIndex',
          component: () => import('@/views/master-data/equipment/index.vue'),
          meta: {
            title: 'Thiết bị',
          },
        },
        {
          path: 'equipment-prameter',
          name: 'EquipmentPrameter',
          component: () => import('@/views/master-data/equipment_parameter/index.vue'),
          meta: {
            title: 'Thông số thiết bị',
          },
        },
        {
          path: 'error-equipments',
          name: 'ErrorEquipment',
          component: () => import('@/views/master-data/errorEquipment/index.vue'),
          meta: {
            title: 'Lỗi dừng máy',
          },
        },
        {
          path: 'standard-parameters',
          name: 'StandardParameter',
          component: () => import('@/views/master-data/standardParameter/index.vue'),
          meta: {
            title: 'Thông số tiêu chuẩn',
          },
        },
        {
          path: 'maintenance-categories',
          name: 'maintenanceCategories',
          component: () => import('@/views/master-data/maintenanceCategories/index.vue'),
          meta: {
            title: 'Hạng mục bảo dưỡng',
          },
        },
      ],
    },
    {
      path: 'inspection-criteria',
      name: 'inspection-criteria',
      component: () => import('@/views/master-data/inspectionCriteria/index.vue'),
      meta: {
        title: t('routes.master-data.inspection-criteria'),
      },
    },
    {
      path: 'template',
      name: 'Template',
      component: () => import('@/views/master-data/template/index.vue'),
      meta: {
        title: 'QL template',
      },
    },
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/master-data/user/accountManagement/index.vue'),
      meta: {
        title: 'QL tài khoản',
      },
    },
    {
      path: 'roles',
      name: 'Roles',
      component: getParentLayout('Roles'),
      redirect: '/master-data/role/index',
      meta: {
        title: t('routes.master-data.role'),
      },
      children: [
        {
          path: 'role',
          name: 'Role',
          component: () => import('@/views/master-data/role/index.vue'),
          meta: {
            title: 'QL chức vụ',
          },
        },
        {
          path: 'permission',
          name: 'Permission',
          component: () => import('@/views/master-data/permission/index.vue'),
          meta: {
            title: 'QL quyền hạn',
          },
        },
      ],
    },
    // Add here...
  ],
};

export default masterData;
