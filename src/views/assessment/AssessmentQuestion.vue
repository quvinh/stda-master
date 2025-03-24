<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <AssessmentSidebar
        :filter="filter"
        @success="handleSidebarFilter"
        @answered="triggerAnswerd"
        @complete="handleComplete"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full border-1 border-gray-300">
      <div v-if="!filter.is_started" class="flex h-full justify-center items-center">
        <div
          class="relative mt-6 flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md"
          v-if="!isCompleted"
        >
          <div class="p-6">
            <h5
              class="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased"
            >
              ĐÁNH GIÁ CHUYỂN ĐỔI SỐ
            </h5>
            <p
              class="block font-sans text-base font-light leading-relaxed text-inherit antialiased"
            >
              Bạn vui lòng nhấn nút dưới để bắt đầu thực hiện đánh giá
            </p>
          </div>
          <div class="p-6 pt-0">
            <Button @click="handleStart" block type="primary"
              ><Icon icon="ant-design:step-forward-outlined" /> Bắt đầu thực hiện đánh giá</Button
            >
          </div>
        </div>

        <div
          class="relative mt-6 flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md"
          v-else
        >
          <div class="p-6">
            <h5
              class="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased"
            >
              BẠN ĐÃ HOÀN THÀNH BÀI ĐÁNH GIÁ
            </h5>
          </div>
          <div class="p-6 pt-0">
            <Button @click="handleViewStatistical" block type="primary"
              ><Icon icon="ant-design:step-forward-outlined" /> Xem đánh giá</Button
            >
            <Button @click="handleStart" block type="primary"
              ><Icon icon="ant-design:step-forward-outlined" /> Bắt đầu thực hiện lại đánh
              giá</Button
            >
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col w-full h-full">
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
                  <RadioGroup class="radio-group" v-model:value="selectedReason[value.id]">
                    <Radio
                      v-for="(item, aIndex) in value.answers"
                      :key="aIndex"
                      @change="handleChange(index, aIndex)"
                      :value="item.id"
                      :style="radioStyle"
                    >
                      {{ item.answer_text }}
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
            :disabled="!quizPrev?.id"
          >
            <Icon icon="ant-design:double-left-outlined" />
            <span>TRƯỚC</span>
          </Button>
          <span class="font-bold text-xl">Câu {{ currQuizz.id }}</span>
          <Button
            type="primary"
            @click="handleNextQuizz"
            class="w-[100px]"
            :disabled="!quizNext?.id"
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
  import { getFirstQuizz, getQuizzById, saveAnswer, startAttemptApi } from '@/api/sys/quizz';
  import Picture1 from '@/assets/images/Picture1.png';
  import Icon from '@/components/Icon/Icon.vue';
  import { Button, Card, Col, message, Radio, RadioGroup, Row } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import AssessmentSidebar from './components/AssessmentSidebar.vue';

  const listQuizzes = ref<any[]>([]);
  const filter = ref<{ currIdx: number; is_started: boolean; attempt_id?: string | number }>({
    currIdx: 0,
    is_started: false,
  });
  const currQuizz = ref<any>({});
  const currIndex = ref(0);
  const selectedReason = ref<any>({});
  const questionNumber = ref<'first' | 'last' | ''>('first');
  const attemptId = ref<number>();
  const quizPrev = ref<any>();
  const quizNext = ref<any>();
  const timer = ref<any>();
  const isCompleted = ref<boolean>(false);

  const radioStyle = reactive({
    display: 'block',
  });

  function handleSidebarFilter(values: any) {
    listQuizzes.value = values.quizz;
    selectedReason.value = {};
    currIndex.value = values.currIndex;
    fetchAnsweredQuestions(values.currIndex);
    filter.value.currIdx = values.currIndex;
    questionNumber.value = values.questionNumber;
  }

  async function fetchAnsweredQuestions(quiz_id?: number) {
    try {
      if (!attemptId.value) {
        console.error('Attempt ID not found!');
        return;
      }
      if (quiz_id) {
        const res: any = await getQuizzById(quiz_id);
        if (res?.id) {
          currQuizz.value = res;
          quizPrev.value = res?.prev_quiz;
          quizNext.value = res?.next_quiz;
        }
      } else {
        const res: any = await getFirstQuizz();
        if (res?.id) {
          filter.value.currIdx = res.id;
          currQuizz.value = res;
          quizPrev.value = res?.prev_quiz;
          quizNext.value = res?.next_quiz;
        }
      }
    } catch (error) {
      message.error('THAO TÁC THẤT BẠI');
    }
  }

  function handlePrevQuizz() {
    if (quizPrev.value?.id) {
      filter.value.currIdx = quizPrev.value.id;
      fetchAnsweredQuestions(quizPrev.value.id);
    }
  }

  function handleNextQuizz() {
    if (quizNext.value?.id) {
      filter.value.currIdx = quizNext.value.id;
      fetchAnsweredQuestions(quizNext.value.id);
    }
  }

  const handleChange = async (index: number, aIndex: number) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(async () => {
      if (!attemptId.value) {
        message.error('Attempt ID not found!');
        return;
      }
      const score = currQuizz.value.questions[index].answers[aIndex].score; // điểm của câu hỏi thuộc quiz
      const answer_id = currQuizz.value.questions[index].answers[aIndex].id;
      const question_id = currQuizz.value.questions[index].id; // question_id
      try {
        await saveAnswer({
          attempt_id: attemptId.value,
          quiz_id: currQuizz.value.id,
          question_id: question_id,
          score: score,
          answer_id: answer_id,
        });
      } catch (error) {
        console.error('Lưu câu trả lời thất bại', error);
      }
    }, 500);
  };

  /**
   * @todo
   * @description Handle start attempt
   */
  async function handleStart() {
    const res: any = await startAttemptApi();
    if (res) {
      isCompleted.value = false;
      attemptId.value = res.id;
      filter.value.is_started = true;
      filter.value.attempt_id = res.id;
      fetchAnsweredQuestions();
    }
  }

  async function triggerAnswerd({ answered }) {
    if (answered) {
      if (currQuizz.value?.id) {
        answered.forEach(({ question_id, answer_id }) => {
          if (question_id) {
            selectedReason.value[question_id] = answer_id;
          }
        });
      }
    }
  }

  function handleComplete() {
    filter.value.is_started = false;
    isCompleted.value = true;
  }

  function handleViewStatistical() {
    //
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
