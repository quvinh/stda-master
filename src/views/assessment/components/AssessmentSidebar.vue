<template>
  <Form
    ref="formRef"
    :model="formData"
    @keypress.enter="handleSubmit"
    @submit="handleSubmit"
    class="bg-white pl-2 pr-2 flex flex-col h-full section-form border-1 border-gray-300"
    layout="vertical"
  >
    <div class="flex-1 flex flex-col h-full">
      <div class="p-1 text-center mb-1">Câu hỏi</div>
      <Row>
        <Col span="6">
          <div class="border-1 border-gray-300 rounded m-[2px] h-[50px]"></div>
        </Col>
        <Col span="6">
          <div class="border-1 border-gray-300 rounded m-[2px] h-[50px]"></div>
        </Col>
        <Col span="6">
          <div class="border-1 border-gray-300 rounded m-[2px] h-[50px]"></div>
        </Col>
        <Col span="6">
          <div class="border-1 border-gray-300 rounded m-[2px] h-[50px]"></div>
        </Col>
        <Col span="6">
          <div class="border-1 border-gray-300 rounded m-[2px] h-[50px]"></div>
        </Col>
        <Col span="6">
          <div class="border-1 border-gray-300 rounded m-[2px] h-[50px]"></div>
        </Col>
        <Col span="6">
          <div class="border-1 border-gray-300 rounded m-[2px] h-[50px]"></div>
        </Col>
        <Col span="6">
          <div class="border-1 border-gray-300 rounded m-[2px] h-[50px]"></div>
        </Col>
      </Row>
    </div>

    <div
      class="sticky bottom-0 left-0 right-0 bg-white pt-1 border-t border-gray-300 section-button"
    >
      <FormItem class="text-center mb-1 p-0">
        <Button block type="primary" size="large" htmlType="submit" class="m-0">
          <Icon icon="ant-design:save-outlined" /> Hoàn thành
        </Button>
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { Button, Col, Form, FormItem, Row } from 'ant-design-vue';
  import { onUnmounted, onMounted, unref, ref, reactive } from 'vue';

  const emit = defineEmits(['success']);

  const formRef = ref();
  const formData = reactive<any>({
    id: null,
    name: null,
  });

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
</script>

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 6px !important;
  }
</style>
