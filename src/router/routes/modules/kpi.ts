import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const survey: AppRouteModule = {
  path: '/survey',
  name: 'Survey',
  component: LAYOUT,
  redirect: '/survey/index',
  meta: {
    orderNo: 70,
    icon: 'ant-design:question-circle-outlined',
    title: 'Thống kê',
  },
  children: [
    {
      path: 'index',
      name: 'UISurvey',
      component: () => import('@/views/kpi/Survey.vue'),
      meta: {
        title: 'Thống kê',
      },
    },
  ],
};

export default survey;
