<template>
  <Form
    ref="formRef"
    :model="formData"
    @keypress.enter="handleSubmit"
    @submit="handleSubmit"
    class="bg-white pl-2 pr-2 flex flex-col h-full section-form border-1 border-gray-300"
    layout="vertical"
  >
    <div class="flex-1 flex flex-col h-[calc(100%-60px)]">
      <Divider style="margin: 4px 0; font-size: 14px">Câu hỏi</Divider>
      <div class="h-[calc(100%-125px)] overflow-auto">
        <Row>
          <Col span="6" v-for="(quizz, index) in quizzes" :key="index">
            <div
              @click="handlechangeQuizz(quizz)"
              :class="`${checkUserAnswer(quizz) ? 'bg-gray-300' : ''} hover:bg-orange-300 border-1 ${curIndex === quizz.id ? 'bg-sky-400' : ''} border-gray-300 rounded m-[2px] h-[50px] flex justify-center items-center cursor-pointer relative animate-fade-in`"
            >
              <div class="font-semibold select-none">{{ index + 1 }}</div>
            </div>
          </Col>
        </Row>
      </div>
      <div class="h-[120px] flex flex-col gap-1">
        <div class="h-[40px] border-1 border-gray-300 flex flex-row w-full">
          <div class="w-2.75/4 flex justify-start items-center p-1">
            <span class="font-bold text-black">Tổng số câu hỏi</span>
          </div>
          <div class="w-1.25/4 border-l-1 border-l-gray-300 flex justify-center items-center">
            <span class="font-bold text-xl text-blue-800">{{ summaryQuiz.total_questions }}</span>
          </div>
        </div>

        <div class="h-[40px] border-1 border-gray-300 flex flex-row w-full">
          <div class="w-2.75/4 flex flex-row gap-1 justify-start items-center p-1">
            <span class="font-bold text-black">Bạn đã trả lời</span>
            <small class="font-semibold text-gray-500"
              >({{
                formatNumber((summaryQuiz.answered_questions / summaryQuiz.total_questions) * 100)
              }}%)</small
            >
          </div>
          <div class="w-1.25/4 border-l-1 border-l-gray-300 flex justify-center items-center">
            <span class="font-bold text-xl text-green-500">{{
              summaryQuiz.answered_questions
            }}</span>
          </div>
        </div>

        <div class="h-[40px] border-1 border-gray-300 flex flex-row w-full">
          <div class="w-2.75/4 flex flex-row gap-1 justify-start items-center p-1">
            <span class="font-bold text-black">Câu hỏi còn lại</span>
            <small class="font-semibold text-gray-500"
              >({{
                formatNumber(
                  (summaryQuiz.unanswered_questions / summaryQuiz.total_questions) * 100,
                )
              }}%)</small
            >
          </div>
          <div class="w-1.25/4 border-l-1 border-l-gray-300 flex justify-center items-center">
            <span class="font-bold text-xl text-red-500">{{
              summaryQuiz.unanswered_questions
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="sticky bottom-0 left-0 right-0 bg-white pt-1 border-t border-gray-300 section-button"
    >
      <FormItem class="text-center mb-1 p-0">
        <Button
          block
          type="primary"
          @click="handleComplete"
          size="large"
          htmlType="submit"
          class="m-0"
          :disabled="!isStarted"
        >
          <Icon icon="ant-design:check-outlined" /> Hoàn thành
        </Button>
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
  import { countQuizComlete, getQuizz, submitQuiz, userAnswerApi } from '@/api/sys/quizz';
  import Icon from '@/components/Icon/Icon.vue';
  import { formatNumber } from '@/utils/helper/tsxHelper';
  import { Button, Col, Divider, Form, FormItem, message, Row } from 'ant-design-vue';
  import { onUnmounted, onMounted, unref, ref, watch } from 'vue';

  const emit = defineEmits(['success', 'answered', 'complete']);
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        currIdx: number;
        is_started: boolean;
        attempt_id?: string | number;
      }>,
    },
  });

  const formRef = ref<any>();

  const curIndex = ref<number>(0);
  const isStarted = ref<boolean>(props.filter?.is_started ?? false);
  const attemptId = ref<number | string | undefined>(props.filter?.attempt_id);
  const summaryQuiz = ref<{
    total_questions: number;
    answered_questions: number;
    unanswered_questions: number;
  }>({ total_questions: 0, answered_questions: 0, unanswered_questions: 0 });
  const formData = ref<any>({
    curQuizz: [],
    currIndex: undefined,
  });
  const quizzes = ref<any[]>([]);
  const userAnswers = ref<{ quiz_id: number; question_id: number; answer_id: number }[]>([]);

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    fetchQuestion();
    fetchUserAnswer();
    fetchQuizComleted();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });

  watch(
    () => props.filter,
    (newValue) => {
      if (newValue) {
        curIndex.value = newValue.currIdx;
        isStarted.value = newValue.is_started;
        attemptId.value = newValue.attempt_id;
        fetchUserAnswer();
        fetchQuizComleted();
      }
    },
    { deep: true },
  );

  async function fetchQuestion(params: any = {}) {
    try {
      const response: any = await getQuizz(params);
      if (response) {
        quizzes.value = response;
        emit('success', {
          quizz: quizzes.value,
          currIndex: curIndex.value,
        });
      }
    } catch (error) {
      message.error('THAO TÁC THẤT BẠI');
    }
  }

  async function fetchUserAnswer() {
    if (!attemptId.value) {
      return;
    }
    try {
      userAnswers.value = [];
      const response: any = await userAnswerApi({
        attempt_id: attemptId.value,
      });
      if (response) {
        userAnswers.value = response.map(({ quiz_id, answer_id, question_id }) => ({
          quiz_id,
          answer_id,
          question_id,
        }));
        emit('answered', { answered: userAnswers.value });
      }
    } catch (error) {
      message.error('THAO TÁC THẤT BẠI');
    }
  }

  async function updateHeight() {
    const sectionForm: any = document.querySelector('.section-form');
    if (sectionForm) {
      const menuHeight = 50;
      const tabHeight = 30;
      const sectionButton: any = sectionForm.querySelector('.section-button');
      const result =
        window.innerHeight -
        menuHeight -
        tabHeight -
        Number(sectionButton.offsetHeight || 0) -
        200 -
        15;
      console.log('height =', result);
      if (result) {
        sectionForm
          .querySelector('.section-search-input')
          ?.style.setProperty('max-height', `${result}px`, 'important');
      }
    }
  }

  function handleSubmit() {
    const form = unref(formRef);
    emit('success', form.getFieldsValue());
  }

  async function fetchQuizComleted() {
    if (!attemptId.value) {
      return;
    }
    try {
      const response: any = await countQuizComlete({
        attempt_id: attemptId.value,
      });
      if (response) {
        summaryQuiz.value = response;
      }
    } catch (error) {
      message.error('THAO TÁC THẤT BẠI');
    }
  }

  function handlechangeQuizz(quizz) {
    if (!isStarted.value) {
      message.warning('Vui lòng nhấn bắt đầu đánh giá!');
      return;
    }
    emit('success', {
      quizz: quizzes.value,
      currIndex: quizz.id,
    });
  }

  async function handleComplete() {
    if (!attemptId.value) {
      console.error('Attempt ID not found!');
      return;
    }
    try {
      const response: any = await submitQuiz({ attempt_id: attemptId.value });
      if (response) {
        message.success('NỘP BÀI THÀNH CÔNG');
        emit('complete', {});
      }
    } catch (error) {
      message.error('NỘP BÀI THẤT BẠI');
    }
  }

  function checkUserAnswer(record: any): boolean {
    const questions: any[] = record?.questions || [];
    const answereds = userAnswers.value.filter(
      ({ quiz_id }) => Number(quiz_id) === Number(record?.id),
    );
    return questions.length === answereds.length;
  }
</script>

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 6px !important;
  }

  .flag-corner {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-top-left-radius: 4px;
    background: #ef4444;
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }
</style>
