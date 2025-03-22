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
                <span>Câu {{ currQuizz.id }}</span>
                <!-- <Button size="small"><Icon icon="ant-design:flag-filled" color="red" /></Button> -->
              </div>
              <div class="h-[20vh] md:h-[45vh] flex flex-col items-center justify-center p-2">
                <img :src="Picture1" class="max-w-full max-h-full object-cover" />
              </div>

              <!-- Nội dung có thể cuộn riêng -->
              <div class="md:flex-1 overflow-auto md:p-2 p-5">
                <h2 class="mb-4">{{ currQuizz.title }}</h2>
                <!-- <p v-for="text in currQuizz.description.split('/')" :key="text">
                  {{ text }}
                </p> -->
              </div>
            </Col>

            <!-- Cột bên phải (Scroll riêng biệt) -->
            <Col :xs="24" :md="12" class="h-full flex md:overflow-hidden">
              <div class="md:flex-1 md:overflow-auto p-2">
                <Card
                  bordered
                  class="w-full mb-2"
                  v-for="(value, index) in currQuizz.questions"
                  :key="index"
                >
                  <p class="font-bold text-base">{{ value.question_text }}</p>
                  <RadioGroup class="radio-group" v-model:value="selectedReason[index]">
                    <Radio
                      v-for="(option, aIndex) in value.answers"
                      :key="aIndex"
                      @change="handleChange(index, aIndex)"
                      :value="option.id"
                      :style="radioStyle"
                    >
                      {{ option.answer_text }}
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
          <Button
            type="primary"
            @click="handlePrevQuizz"
            class="w-[100px]"
            :disabled="questionNumber === 'first'"
          >
            <Icon icon="ant-design:double-left-outlined" />
            <span>TRƯỚC</span>
          </Button>
          <span class="font-bold text-xl">Câu {{ currQuizz.id }}</span>
          <Button
            type="primary"
            @click="handleNextQuizz"
            class="w-[100px]"
            :disabled="questionNumber === 'last'"
          >
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
  import { Button, Card, Col, message, Radio, RadioGroup, Row } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { answeredQuestions, saveAnswer } from '@/api/sys/quizz';

  const listQuizzes = ref<any[]>([]);
  const filter = ref<{ currIdx: number }>({ currIdx: 0 });
  const currQuizz = ref<any>({});
  const currIndex = ref(0);
  const selectedReason = ref<{ [key: number]: any }>({
    0: 1, // Câu hỏi đầu tiên chưa chọn gì
    1: 2, // Câu hỏi thứ hai đã chọn đáp án có ID là 5
  });
  const questionNumber = ref<'first' | 'last' | ''>('first');

  const radioStyle = reactive({
    display: 'block',
  });

  function handleSidebarFilter(values: any) {
    listQuizzes.value = values.quizz;
    selectedReason.value = [];
    currIndex.value = values.currIndex;
    currQuizz.value = values.quizz[currIndex.value];
    fetchAnsweredQuestions();
    filter.value.currIdx = currIndex.value;
    questionNumber.value = values.questionNumber;
  }

  async function fetchAnsweredQuestions() {
    try {
      const response: any = await answeredQuestions({ quiz_id: currQuizz.value.id });
      if (response) {
        response.forEach((id, index) => {
          selectedReason.value[index] = id;
        });
      }
    } catch (error) {
      message.error('THAO TÁC THẤT BẠI');
    }
  }

  function handlePrevQuizz() {
    selectedReason.value = [];
    currIndex.value--;
    currQuizz.value = listQuizzes.value[currIndex.value];
    if (Number(currQuizz.value.id) - 2 < 0) questionNumber.value = 'first';
    else questionNumber.value = '';
    filter.value.currIdx = currIndex.value;
  }

  function handleNextQuizz() {
    selectedReason.value = [];
    currIndex.value++;
    filter.value.currIdx = currIndex.value;
    currQuizz.value = listQuizzes.value[currIndex.value];
    if (Number(currQuizz.value.id) >= listQuizzes.value.length) questionNumber.value = 'last';
    else questionNumber.value = '';
  }

  const handleChange = async (index: number, aIndex: number) => {
    const score = currQuizz.value.questions[index].answers[aIndex].score; // điểm của câu hỏi thuộc quiz
    const answer_id = currQuizz.value.questions[index].answers[aIndex].id;
    const question_id = currQuizz.value.questions[index].id; // question_id
    try {
      await saveAnswer({
        quiz_id: currQuizz.value.id,
        question_id: question_id,
        score: score,
        answer_id: answer_id,
      });
    } catch (error) {
      console.error('Lưu câu trả lời thất bại', error);
    }
  };
</script>

<style lang="less" scoped>
  :deep(.ant-card-head-title) {
    white-space: normal !important;
  }

  :deep(.ant-card-bordered) {
    border: 1px solid #d1d5db !important;
  }
</style>
