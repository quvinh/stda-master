import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const accountSetting: AppRouteModule = {
  path: '/account-settings',
  name: 'AccountSetting',
  component: LAYOUT,
  redirect: '/account-settings',
  meta: {
    orderNo: 200,
    icon: 'ant-design:setting-outlined',
    title: t('routes.master-data.account-settings'),
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '',
      name: 'AccountSettingPage',
      component: () => import('@/views/master-data/user/accountSetting/AccountSetting.vue'),
      meta: {
        // affix: true,
        title: t('routes.master-data.account-settings'),
      },
    },
  ],
};

export default accountSetting;
