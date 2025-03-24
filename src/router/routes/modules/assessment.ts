import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const assessment: AppRouteModule = {
  path: '/assessment',
  name: 'AssessmentPage',
  component: LAYOUT,
  redirect: '/assessment/index',
  meta: {
    orderNo: 30,
    icon: 'ant-design:question-circle-outlined',
    title: 'Đánh giá chuyển đổi số',
  },
  children: [
    {
      path: 'index',
      name: 'UIAssessment',
      component: () => import('@/views/assessment/AssessmentQuestion.vue'),
      meta: {
        title: 'Thực hiện đánh giá',
      },
    },
    {
      path: 'statistical',
      name: 'UIStatistical',
      component: () => import('@/views/assessment/StatisticalHistory.vue'),
      meta: {
        title: 'Kết quả đánh giá',
      },
    },
  ],
};

export default assessment;
