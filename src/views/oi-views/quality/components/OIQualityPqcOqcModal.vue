<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="Kiểm tra chỉ tiêu" style="top: 10px">
    <Form ref="formRef" :model="formData" layout="vertical">
      <div class="max-h-[450px] overflow-y-auto">
        <template v-for="(item, index) in criteria" :key="index">
          <template v-if="determineTypeInput(item.input_type) === 1">
            <FormItem :label="item.criteria_name" :key="item.id" style="margin-bottom: 12px">
              <InputGroup compact v-model:value="formData[item.id]">
                <FormItem
                  :key="item.id"
                  :name="item.id"
                  noStyle
                  :rules="[{ required: true, message: 'Dữ liệu không được để trống!' }]"
                >
                  <Input
                    style="width: calc(100% - 80px)"
                    placeholder="Nhập giá trị"
                    @change="
                      (e) => handleInputChange(e.target.value, item.id, item.acceptablerange)
                    "
                  />
                </FormItem>
                <Button
                  :style="{
                    width: '80px',
                    backgroundColor: buttonStatus[item.id]?.bg || 'white',
                    color: buttonStatus[item.id]?.color || 'black',
                  }"
                >
                  {{ buttonStatus[item.id]?.status || 'ok_ng' }}
                </Button>
              </InputGroup>
            </FormItem>
          </template>
          <template v-else-if="determineTypeInput(item.input_type) === 2">
            <FormItem
              :label="item.criteria_name"
              :key="item.id"
              :name="item.id"
              style="margin-bottom: 12px"
              :rules="[{ required: true, message: 'Dữ liệu không được để trống!' }]"
            >
              <RadioGroup
                v-model:value="formData[item.id]"
                style="display: flex; text-align: left"
                optionType="button"
                buttonStyle="solid"
                @change="(e) => handleChange(item.id, e.target.value)"
              >
                <RadioButton value="OK" class="w-[100%] text-center">OK</RadioButton>
                <!-- <RadioButton
                  value="CXL"
                  :class="`w-[100%] text-center ${formData[item.id] === 'CXL' ? 'yellow-button' : ''}`"
                  >CXL
                </RadioButton> -->
                <RadioButton
                  value="NG"
                  :class="`w-[100%] text-center ${formData[item.id] === 'NG' ? 'red-button' : ''}`"
                  >NG
                </RadioButton>
              </RadioGroup>
            </FormItem>
          </template>
          <template v-else-if="determineTypeInput(item.input_type) === 3">
            <FormItem
              style="margin-bottom: 12px"
              :key="item.id"
              :name="item.id"
              :label="item.criteria_name"
              :rules="[{ required: true, message: 'Dữ liệu không được để trống!' }]"
            >
              <Input v-model:value="formData[item.id]" placeholder="Nhập giá trị" />
            </FormItem>
          </template>
        </template>
      </div>
    </Form>
    <template #footer>
      <!-- <Button @click="handleSave">Lưu</Button> -->
      <Button type="primary" @click="() => handleSubmit('ok')">OK</Button>
      <Button type="primary" danger @click="() => handleSubmit('ng')">NG</Button>
      <Button @click="closeModal">Hủy</Button>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import {
    Button,
    Form,
    FormItem,
    Input,
    InputGroup,
    RadioButton,
    RadioGroup,
  } from 'ant-design-vue';
  import { unref, ref } from 'vue';

  const emit = defineEmits(['success', 'save']);
  const formRef = ref<any>();
  const formData = ref<any>({});
  const buttonStatus = ref<any>({});
  const criteria = ref<any[]>([]);

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    criteria.value = data?.criteria || [];
    const savedData = data?.savedFormData || {};
    formData.value = { ...savedData };
    setModalProps({ loading: false, confirmLoading: false });
  });

  async function handleSubmit(check: 'ok' | 'ng') {
    try {
      const form = unref(formRef);
      setModalProps({ loading: true, confirmLoading: true });
      const values = await form.validate();
      emit('success', { values, result: check });
      closeModal();
    } catch (error) {
      console.log(error);
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  // function handleSave() {
  //   emit('save', { ...formData.value });
  // }

  function handleChange(id, value) {
    formData.value[id] = value;
  }

  function checkMeasurement(measurement, acceptableRange): boolean {
    acceptableRange = acceptableRange.trim();
    measurement = parseFloat(measurement);
    acceptableRange = acceptableRange.replace(/≤/g, '<=').replace(/≥/g, '>=');
    const regex = /^(<=|>=|>|<|=|==)?\s*(\d+(\.\d+)?)\s*(\w+)?$/;

    if (regex.test(acceptableRange)) {
      const matches = acceptableRange.match(regex);
      const comparisonType = matches[1];
      const compareValue = parseFloat(matches[2]);

      switch (comparisonType) {
        case '<=':
          return measurement <= compareValue;
        case '>=':
          return measurement >= compareValue;
        case '>':
          return measurement > compareValue;
        case '<':
          return measurement < compareValue;
        case '=':
        case '==':
          return measurement === compareValue;
        default:
          return false;
      }
    }
    return false;
  }

  function handleInputChange(value, id, range) {
    if (value === '') {
      buttonStatus.value = {
        ...buttonStatus.value,
        [id]: {
          status: 'ok_ng',
          bg: 'white',
          color: 'black',
        },
      };
    } else {
      const isValid = checkMeasurement(parseFloat(value), range);
      buttonStatus.value = {
        ...buttonStatus.value,
        [id]: {
          status: isValid ? 'OK' : 'NG',
          bg: isValid ? 'green' : 'red',
          color: 'white',
        },
      };
    }
  }

  function determineTypeInput(acceptablerange: any): number {
    if (acceptablerange === null) return 3;
    if (acceptablerange === 'ok_ng') return 2;
    return 1;
  }
</script>
