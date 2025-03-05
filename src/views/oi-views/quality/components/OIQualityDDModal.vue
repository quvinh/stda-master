<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Kiểm tra chỉ tiêu"
    @ok="handleSubmit"
  >
    <Form ref="formRef" :model="formData" layout="vertical">
      <FormItem
        name="check"
        style="margin-bottom: 12px"
        :rules="[{ required: true, message: 'Vui lòng kiểm tra chỉ tiêu!' }]"
      >
        <RadioGroup
          v-model:value="formData.check"
          style="display: flex; text-align: left"
          optionType="button"
          buttonStyle="solid"
        >
          <RadioButton value="ok" class="w-[100%] text-center">OK</RadioButton>
          <RadioButton
            value="ng"
            :class="`w-[100%] text-center ${formData.check === 'NG' ? 'red-button' : ''}`"
            >NG
          </RadioButton>
        </RadioGroup>
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Form, FormItem, RadioButton, RadioGroup } from 'ant-design-vue';
  import { ref, unref } from 'vue';

  const emit = defineEmits(['success']);
  const formRef = ref<any>();
  const formData = ref<any>({});
  const criteria = ref<any[]>([]);

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    criteria.value = data?.criteria || [];
    const savedData = data?.savedFormData || {};
    formData.value = { ...savedData };
    setModalProps({ loading: false, confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      const form = unref(formRef);
      setModalProps({ loading: true, confirmLoading: true });
      const values = await form.validate();
      console.log(values);
      emit('success', { result: values?.check });
      closeModal();
    } catch (error) {
      console.log(error);
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }
</script>
