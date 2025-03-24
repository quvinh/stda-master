<template>
  <PageWrapper
    :title="`Kết quả đánh giá chuyển đổi số`"
    content="TỰ KIỂM TRA ĐÁNH GIÁ KỸ THUẬT SỐ (STDA)"
    contentBackground
    @back="goBack"
  >
    <template #extra>
      <!-- <a-button type="primary"> Export </a-button> -->
    </template>
    <div class="container mx-auto mb-[100px]">
      <Row class="h-[350px] w-full" :gutter="[8, 8]">
        <Col span="12" class="p-1">
          <AverageBarChart class="border-1 border-gray-300 rounded shadow-md" />
        </Col>
        <Col span="12" class="p-1">
          <AverageRadarChart class="border-1 border-gray-300 rounded shadow-md" />
        </Col>
      </Row>

      <Row class="h-[350px] w-full" :gutter="[8, 8]">
        <Col span="12" class="p-1">
          <FrequencyPieChart class="border-1 border-gray-300 rounded shadow-md" />
        </Col>
        <Col span="12" class="p-1">
          <FrequencyBarChart class="border-1 border-gray-300 rounded shadow-md" />
        </Col>
      </Row>

      <div class="flex flex-row items-stretch gap-2 w-full pr-2 animate-fade-in mt-1">
        <div class="rounded flex flex-col border-2 border-green-700 w-1/2 shadow-md">
          <div
            class="bg-green-700 text-white flex flex-row justify-start items-center px-2 h-[56px]"
          >
            <Icon icon="ant-design:tags-filled" class="mr-1" size="35" />
            <span class="text-xl"
              >{{ '0' }}% trong số tất cả các câu hỏi bạn đã chọn mô tả bạn là người dùng kỹ thuật
              số Cấp tiến.</span
            >
          </div>
          <div class="p-3"
            >Xin chúc mừng nếu tỷ lệ % được hiển thị ở đây rất cao, điều này sẽ mô tả bạn là một
            <span class="font-semibold"
              >người dùng rất tiến bộ và sáng suốt, người quảng bá và ủng hộ</span
            >
            số hóa trong không gian làm việc, tổ chức của bạn và ngay cả trong lối sống cá nhân của
            bạn để hướng tới tương lai bền vững trong kinh doanh, sự nghiệp và cuộc sống của bạn.
            Nếu bạn đang ở vị trí ảnh hưởng & đầu tư vào số hóa, xếp hạng cao này sẽ mô tả bạn là
            một <span class="font-semibold">nhà lãnh đạo đầu tư</span> vào số hóa &
            <span class="font-semibold">nâng cao kỹ năng cho những người khác</span> hướng tới số
            hóa cấp cao và <span class="font-semibold">dẫn đầu trong việc</span> thúc đẩy tổ chức
            trong hành trình chuyển đổi</div
          >
        </div>

        <div class="rounded flex flex-col border-2 border-sky-800 w-1/2 shadow-md">
          <div class="bg-sky-800 text-white flex flex-row justify-start items-center px-2 h-[56px]">
            <Icon icon="ant-design:tags-filled" class="mr-1" size="35" />
            <span class="text-xl"
              >{{ '6' }}% trong số tất cả các câu hỏi bạn đã chọn mô tả bạn là Đánh giá cao việc số
              hóa.</span
            >
          </div>
          <div class="p-3"
            >Đánh giá cao/Đánh giá cao mô tả bạn là một
            <span class="font-semibold">người sử dụng tích cực</span> số hóa,
            <span class="font-semibold">hiểu rõ</span> các tính năng của nó,
            <span class="font-semibold">tận hưởng</span> lợi ích của nó trong không gian làm việc
            của bạn, trong tổ chức của bạn, trong lối sống của riêng bạn. Bạn đang tích cực sử dụng
            số hóa để thúc đẩy năng suất bền vững trong lĩnh vực trách nhiệm của mình. Bạn cũng đang
            <span class="font-semibold">óng góp tích cực vào</span> hành trình chuyển đổi kỹ thuật
            số của tổ chức với tư cách là một
            <span class="font-semibold">người tham gia tích cực</span>. Vui lòng tiếp tục có động
            lực để duy trì động lực này để trở thành một người sử dụng số hóa tích cực và hiệu quả;
            liên tục nâng cao & trau dồi kiến thức & kỹ năng của bạn để trở thành một công dân kỹ
            thuật số được xếp hạng Tiến bộ/Tiến bộ trong tổ chức của bạn</div
          >
        </div>
      </div>
      <div class="flex flex-row items-stretch gap-2 w-full pr-2 mt-2 animate-fade-in">
        <div class="rounded flex flex-col border-2 border-purple-700 w-1/2 shadow-md">
          <div
            class="bg-purple-700 text-white flex flex-row justify-start items-center px-2 h-[56px]"
          >
            <Icon icon="ant-design:tags-filled" class="mr-1" size="35" />
            <span class="text-xl"
              >{{ '5' }}% trong số tất cả các câu hỏi bạn đã chọn mô tả bạn là Đánh giá cao việc số
              hóa.</span
            >
          </div>
          <div class="p-3"
            >Đánh giá cao/Đánh giá cao mô tả bạn là một người sử dụng tích cực số hóa, hiểu rõ các
            tính năng của nó, tận hưởng lợi ích của nó trong không gian làm việc của bạn, trong tổ
            chức của bạn, trong lối sống của riêng bạn. Bạn đang tích cực sử dụng số hóa để thúc đẩy
            năng suất bền vững trong lĩnh vực trách nhiệm của mình. Bạn cũng đang đóng góp tích cực
            vào hành trình chuyển đổi kỹ thuật số của tổ chức với tư cách là một người tham gia tích
            cực. Vui lòng tiếp tục có động lực để duy trì động lực này để trở thành một người sử
            dụng số hóa tích cực và hiệu quả; liên tục nâng cao & trau dồi kiến thức & kỹ năng của
            bạn để trở thành một công dân kỹ thuật số được xếp hạng Tiến bộ/Tiến bộ trong tổ chức
            của bạn</div
          >
        </div>

        <div class="rounded flex flex-col border-2 border-orange-700 w-1/2 shadow-md">
          <div
            class="bg-orange-700 text-white flex flex-row justify-start items-center px-2 h-[56px]"
          >
            <Icon icon="ant-design:tags-filled" class="mr-1" size="35" />
            <span class="text-xl"
              >{{ '5' }}% trong số tất cả các câu hỏi bạn đã chọn mô tả bạn là Đánh giá cao việc số
              hóa.</span
            >
          </div>
          <div class="p-3"
            >Đánh giá cao/Đánh giá cao mô tả bạn là một người sử dụng tích cực số hóa, hiểu rõ các
            tính năng của nó, tận hưởng lợi ích của nó trong không gian làm việc của bạn, trong tổ
            chức của bạn, trong lối sống của riêng bạn. Bạn đang tích cực sử dụng số hóa để thúc đẩy
            năng suất bền vững trong lĩnh vực trách nhiệm của mình. Bạn cũng đang đóng góp tích cực
            vào hành trình chuyển đổi kỹ thuật số của tổ chức với tư cách là một người tham gia tích
            cực. Vui lòng tiếp tục có động lực để duy trì động lực này để trở thành một người sử
            dụng số hóa tích cực và hiệu quả; liên tục nâng cao & trau dồi kiến thức & kỹ năng của
            bạn để trở thành một công dân kỹ thuật số được xếp hạng Tiến bộ/Tiến bộ trong tổ chức
            của bạn</div
          >
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '@/components/Page';
  import { useGo } from '@/hooks/web/usePage';
  import { useTabs } from '@/hooks/web/useTabs';
  import { getQuizAttemptAverage, getQuizAttemptById } from '@/api/sys/quizz';
  import AverageBarChart from './components/charts/AverageBarChart.vue';
  import AverageRadarChart from './components/charts/AverageRadarChart.vue';
  import FrequencyPieChart from './components/charts/FrequencyPieChart.vue';
  import FrequencyBarChart from './components/charts/FrequencyBarChart.vue';
  import dayjs from 'dayjs';
  import { Col, Row } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  defineOptions({ name: 'StatisticalDetail' });

  const route = useRoute();
  const go = useGo();

  const attemptId = ref(route.params?.id);
  const attempt = ref<any>();
  const { setTitle } = useTabs();
  setTitle('Đánh giá');

  onMounted(() => {
    loadAttempt();
  });

  async function loadAttempt() {
    if (!attemptId.value) return;
    const res: any = await getQuizAttemptById(Number(attemptId.value));
    if (res?.id) {
      attempt.value = res;
      setTitle('Đánh giá: ' + dayjs(res?.started_at).format('DD/MM HH:mm'));
      loadDataAverrageChart();
    }
  }

  async function loadDataAverrageChart() {
    if (attempt.value?.id) {
      const res: any = await getQuizAttemptAverage(
        Number(attempt.value?.user_id),
        Number(attempt.value.id),
      );
      console.log(res);
    }
  }

  function goBack() {
    go('/assessment/statistical');
  }
</script>

<style></style>
