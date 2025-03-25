import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
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
    permissions: [PermissionEnum.ADMIN],
  },
  children: [
    {
      path: 'quizz',
      name: 'Quizzes',
      component: () => import('@/views/master-data/quizz/index.vue'),
      meta: {
        title: t('routes.master-data.quizz'),
        // permissions: [PermissionEnum.CUSTOMER_SEARCH],
      },
    },
    {
      path: 'question',
      name: 'Question',
      component: () => import('@/views/master-data/question/index.vue'),
      meta: {
        title: t('routes.master-data.question'),
      },
    },
    {
      path: 'answer',
      name: 'Answer',
      component: () => import('@/views/master-data/answer/index.vue'),
      meta: {
        title: t('routes.master-data.answer'),
      },
    },
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/master-data/user/accountManagement/index.vue'),
      meta: {
        title: 'QL tài khoản',
        hideMenu: true,
      },
    },
  ],
};

export default masterData;
