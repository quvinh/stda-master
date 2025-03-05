import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const quality: AppRouteModule = {
  path: '/quality',
  name: 'QualityPage',
  component: LAYOUT,
  redirect: '/quality/qc',
  meta: {
    orderNo: 40,
    icon: 'ion:easel-outline',
    title: 'Chất lượng',
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'qc',
      name: 'UIQC',
      component: () => import('@/views/quality/qc/QC.vue'),
      meta: {
        title: 'Chất lượng',
      },
    },
    // {
    //   path: 'ddqc',
    //   name: 'UIDDQC',
    //   component: () => import('@/views/quality/ddqc/DDQC.vue'),
    //   meta: {
    //     // affix: true,
    //     title: 'QC Đầu đơn',
    //   },
    // },
    // {
    //   path: 'iqc',
    //   name: 'UIIQC',
    //   component: () => import('@/views/quality/iqc/IQC.vue'),
    //   meta: {
    //     // affix: true,
    //     title: 'IQC',
    //   },
    // },
    // {
    //   path: 'pqc',
    //   name: 'UIPQC',
    //   component: () => import('@/views/quality/pqc/PQC.vue'),
    //   meta: {
    //     // affix: true,
    //     title: 'PQC',
    //   },
    // },
    // {
    //   path: 'oqc',
    //   name: 'UIOQC',
    //   component: () => import('@/views/quality/oqc/OQC.vue'),
    //   meta: {
    //     // affix: true,
    //     title: 'OQC',
    //   },
    // },
  ],
};

export default quality;
