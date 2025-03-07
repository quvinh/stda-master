<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <AssessmentSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full border-1 border-gray-300">
      <div class="flex flex-col w-[99%] h-full justify-between">
        <div class="h-full">
          <div class="flex flex-col justify-start items-start p-1 w-full">
            <span class="font-semibold text-gray-400">Họ và tên: Nguyễn Văn A</span>
            <span class="font-semibold text-black text-xl">Câu hỏi số 1</span>
          </div>
          <Row :gutter="10" class="h-full">
            <Col span="12">
              <div class="h-full flex flex-col justify-start items-center p-2">
                <img :src="Picture1" class="max-w-full max-h-[50%]" />
                <div class="h-[400px] overflow-auto">
                  <h2 class="mb-4"
                    >Nhiều công ty có tuyên bố Tầm nhìn & Sứ mệnh được đóng khung độc đáo trong
                    phòng họp quản lý.
                  </h2>
                  <p>Các từ rất rộng và lỏng lẻo không có mục tiêu hữu hình để đạt được</p>
                  <p>Không có mốc thời gian rõ ràng cho mục tiêu cụ thể</p>
                  <p
                    >Ban quản lý không tiết lộ khoản đầu tư nào sẽ được thực hiện, doanh thu cần đạt
                    được và lợi ích cho các bên liên quan</p
                  >
                  <p>Nó thiếu các chi tiết định lượng và định tính </p>
                  <p
                    >“Góp phần vào phúc lợi của Trái đất” hoàn toàn không cụ thể để đạt được ESG
                    “góp phần vào phúc lợi của Trái đất” hoàn toàn không cụ thể để đạt được ESG“góp
                    phần vào phúc lợi của Trái đất” hoàn toàn không cụ thể để đạt được ESG</p
                  >
                  <h2 class="mb-4"
                    >Nhiều công ty có tuyên bố Tầm nhìn & Sứ mệnh được đóng khung độc đáo trong
                    phòng họp quản lý.
                  </h2>
                  <p>Các từ rất rộng và lỏng lẻo không có mục tiêu hữu hình để đạt được</p>
                  <p>Không có mốc thời gian rõ ràng cho mục tiêu cụ thể</p>
                  <p
                    >Ban quản lý không tiết lộ khoản đầu tư nào sẽ được thực hiện, doanh thu cần đạt
                    được và lợi ích cho các bên liên quan</p
                  >
                  <p>Nó thiếu các chi tiết định lượng và định tính </p>
                  <p
                    >“Góp phần vào phúc lợi của Trái đất” hoàn toàn không cụ thể để đạt được ESG
                    “góp phần vào phúc lợi của Trái đất” hoàn toàn không cụ thể để đạt được ESG“góp
                    phần vào phúc lợi của Trái đất” hoàn toàn không cụ thể để đạt được ESG</p
                  >
                </div>
              </div>
            </Col>
            <Col span="12">
              <div class="h-full flex flex-col justify-start items-center overflow-auto gap-2 p-2">
                <Card
                  title="Thành thật mà nói, bạn nghĩ V&M từ ngữ truyền thống như vậy hữu ích như thế nào trong thời đại này?"
                  class="w-full"
                  v-for="(_, index) in [...new Array(3)]"
                  :key="index"
                >
                  <RadioGroup v-model:value="selectedReason" class="radio-group">
                    <Radio
                      v-for="(option, index) in reasons"
                      :key="index"
                      :value="option"
                      :style="radioStyle"
                    >
                      {{ option }}
                    </Radio>
                  </RadioGroup>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
        <div class="h-[60px] flex justify-between items-center p-1">
          <Button type="primary">TRƯỚC</Button>
          <Button type="primary">SAU</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import AssessmentSidebar from './components/AssessmentSidebar.vue';
  import Picture1 from '@/assets/images/Picture1.png';
  import { Button, Card, Col, Radio, RadioGroup, Row } from 'ant-design-vue';

  const filter = ref<any>();
  const selectedReason = ref<any>(null);
  const reasons = ref<string[]>([
    'Tất cả các điều khoản I-V của tuyên bố Sứ mệnh Tầm nhìn này là chung chung. ',
    'V+M này có những từ hành động tốt “giảm”, “cải thiện”, “đạt được” “đem lại sự hài lòng” - nhưng không có mục tiêu rõ ràng',
    'V & M này ít nhất tuyên bố nhiều điều nó muốn đạt được.',
    'Tôi sẽ chỉ chọn V+M này nếu nó chứa các mục tiêu hữu hình, với các mốc thời gian rõ ràng; sự đầu tư cần thiết; cùng có lợi cho cả nhân viên và khách hàng',
  ]);
  const radioStyle = reactive({
    display: 'block',
  });

  function handleSidebarFilter(values: any) {
    console.log(values);
  }
</script>

<style lang="less" scoped>
  :deep(.ant-card-head-title) {
    white-space: normal !important;
  }
</style>
