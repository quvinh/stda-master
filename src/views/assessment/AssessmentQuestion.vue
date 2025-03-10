<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <AssessmentSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full border-1 border-gray-300">
      <div class="flex flex-col w-full h-full">
        <!-- Vùng nội dung chính -->
        <div class="md:flex-1 flex md:overflow-hidden overflow-auto">
          <Row :gutter="10" class="md:h-full w-full md:flex-1">
            <!-- Cột bên trái -->
            <Col :xs="24" :md="12" class="flex flex-col md:h-full">
              <!-- Ảnh chiếm 50% chiều cao -->
              <div class="w-full mb-1 p-2 font-bold text-xl flex justify-between items-start">
                <span>Câu 1</span>
                <Button size="small"><Icon icon="ant-design:flag-filled" color="red" /></Button>
              </div>
              <div class="h-[20vh] md:h-[45vh] flex flex-col items-center justify-center p-2">
                <img :src="Picture1" class="max-w-full max-h-full object-cover" />
              </div>

              <!-- Nội dung có thể cuộn riêng -->
              <div class="md:flex-1 overflow-auto md:p-2 p-5">
                <h2 class="mb-4"
                  >Nhiều công ty có tuyên bố Tầm nhìn & Sứ mệnh được đóng khung độc đáo trong phòng
                  họp quản lý.</h2
                >
                <p>Các từ rất rộng và lỏng lẻo không có mục tiêu hữu hình để đạt được</p>
                <p>Không có mốc thời gian rõ ràng cho mục tiêu cụ thể</p>
                <p
                  >Ban quản lý không tiết lộ khoản đầu tư nào sẽ được thực hiện, doanh thu cần đạt
                  được và lợi ích cho các bên liên quan</p
                >
                <p>Nó thiếu các chi tiết định lượng và định tính </p>
                <p>“Góp phần vào phúc lợi của Trái đất” hoàn toàn không cụ thể để đạt được ESG</p>
                <p>Nó thiếu các chi tiết định lượng và định tính </p>
              </div>
            </Col>

            <!-- Cột bên phải (Scroll riêng biệt) -->
            <Col :xs="24" :md="12" class="h-full flex md:overflow-hidden">
              <div class="md:flex-1 md:overflow-auto p-2">
                <Card
                  bordered
                  title="Thành thật mà nói, bạn nghĩ V&M từ ngữ truyền thống như vậy hữu ích như thế nào trong thời đại này?"
                  class="w-full mb-2"
                  v-for="(_, index) in [...new Array(5)]"
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

        <!-- Thanh điều hướng giữ cố định -->
        <div
          class="h-[60px] flex justify-between items-center p-1 bg-white border-t border-t-gray-300"
        >
          <Button type="primary" class="w-[100px]">
            <Icon icon="ant-design:double-left-outlined" />
            <span>TRƯỚC</span>
          </Button>
          <span class="font-bold text-xl">Câu 1</span>
          <Button type="primary" class="w-[100px]">
            <span>SAU</span>
            <Icon icon="ant-design:double-right-outlined" />
          </Button>
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
  import Icon from '@/components/Icon/Icon.vue';

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

  :deep(.ant-card-bordered) {
    border: 1px solid #d1d5db !important;
  }
</style>
