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
          <Col span="6" v-for="(_, index) in [...new Array(questionNumber)]" :key="index">
            <div
              :class="`${questionNumber - remainQuestionNumber >= index + 1 ? 'bg-gray-300' : ''} hover:bg-orange-300 border-1 border-gray-300 rounded m-[2px] h-[50px] flex justify-center items-center cursor-pointer relative`"
            >
              <div class="font-semibold select-none">{{ index + 1 }}</div>
              <!-- Thêm góc cờ đỏ -->
              <div v-if="isFlagged(index)" class="flag-corner"></div>
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
            <span class="font-bold text-xl text-blue-800">{{ questionNumber }}</span>
          </div>
        </div>

        <div class="h-[40px] border-1 border-gray-300 flex flex-row w-full">
          <div class="w-2.75/4 flex flex-row gap-1 justify-start items-center p-1">
            <span class="font-bold text-black">Bạn đã trả lời</span>
            <small class="font-semibold text-gray-500"
              >({{
                formatNumber(((questionNumber - remainQuestionNumber) / questionNumber) * 100)
              }}%)</small
            >
          </div>
          <div class="w-1.25/4 border-l-1 border-l-gray-300 flex justify-center items-center">
            <span class="font-bold text-xl text-green-500">{{
              questionNumber - remainQuestionNumber
            }}</span>
          </div>
        </div>

        <div class="h-[40px] border-1 border-gray-300 flex flex-row w-full">
          <div class="w-2.75/4 flex flex-row gap-1 justify-start items-center p-1">
            <span class="font-bold text-black">Câu hỏi còn lại</span>
            <small class="font-semibold text-gray-500"
              >({{ formatNumber((remainQuestionNumber / questionNumber) * 100) }}%)</small
            >
          </div>
          <div class="w-1.25/4 border-l-1 border-l-gray-300 flex justify-center items-center">
            <span class="font-bold text-xl text-red-500">{{ remainQuestionNumber }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="sticky bottom-0 left-0 right-0 bg-white pt-1 border-t border-gray-300 section-button"
    >
      <FormItem class="text-center mb-1 p-0">
        <Button block type="primary" size="large" htmlType="submit" class="m-0">
          <Icon icon="ant-design:check-outlined" /> Hoàn thành
        </Button>
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { formatNumber } from '@/utils/helper/tsxHelper';
  import { Button, Col, Divider, Form, FormItem, Row } from 'ant-design-vue';
  import { onUnmounted, onMounted, unref, ref, reactive } from 'vue';

  const emit = defineEmits(['success']);

  const formRef = ref<any>();
  const formData = reactive<any>({
    id: null,
    name: null,
  });
  const questionNumber = ref<number>(180);
  const remainQuestionNumber = ref<number>(165);

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });

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

  function isFlagged(index) {
    return [1, 3, 7, 25].includes(index);
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
