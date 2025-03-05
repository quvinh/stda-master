<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="Kiểm tra chỉ tiêu" style="top: 40px">
    <Form ref="formRef" :model="formData" layout="vertical">
      <div class="max-h-[450px] overflow-y-auto">
        <template v-for="(item, index) in criteria" :key="index">
          <template v-if="determineTypeInput(item.evaluation_method) === 1">
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
          <template v-else-if="determineTypeInput(item.evaluation_method) === 2">
            <FormItem
              :label="item.name"
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
                <RadioButton value="pass" class="w-[100%] text-center">OK</RadioButton>
                <!-- <RadioButton
                  value="CXL"
                  :class="`w-[100%] text-center ${formData[item.id] === 'CXL' ? 'yellow-button' : ''}`"
                  >CXL
                </RadioButton> -->
                <RadioButton
                  value="fail"
                  :class="`w-[100%] text-center ${formData[item.id] === 'NG' ? 'red-button' : ''}`"
                  >NG
                </RadioButton>
              </RadioGroup>
            </FormItem>
          </template>
          <template v-else-if="determineTypeInput(item.evaluation_method) === 3">
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
      <Button type="primary" @click="() => handleSubmit('ok')">OK</Button>
      <Button type="primary" danger @click="() => handleSubmit('ng')">NG</Button>
      <Button @click="closeModal">Hủy</Button>
    </template>
  </BasicModal>
  <div>
    <NGInputModal
      :width="500"
      :draggable="false"
      :maskClosable="true"
      @register="registerNGINputModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import {
    Button,
    Form,
    FormItem,
    Input,
    // Form,
    // FormItem,
    // Input,
    // InputGroup,
    // RadioButton,
    // RadioGroup,
    message,
    RadioButton,
    RadioGroup,
  } from 'ant-design-vue';
  import { ref, unref } from 'vue';
  import NGInputModal from './NGInputModal.vue';
  import { updateApi } from '@/api/sys/pallet';

  const emit = defineEmits(['success', 'save']);
  const formRef = ref<any>();
  const formData = ref<any>({
    material: '',
    size: '',
    quantification: '',
    appearance: '',
  });
  // const buttonStatus = ref<any>({});
  const dataPallet = ref();
  const material = ref();
  const datas = ref<any[]>([]);
  const criteria = ref<any[]>([]);
  const [registerNGINputModal] = useModal();
  const buttonStatus = ref<any>({});

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    datas.value = [];
    dataPallet.value = data.data;
    material.value = dataPallet.value.material?.material_name;
    datas.value.push(dataPallet.value);
    criteria.value = data?.criteria || [];
    const savedData = data?.savedFormData || {};
    formData.value = { ...savedData };
    setModalProps({ loading: false, confirmLoading: false });
  });

  async function handleSubmit(type: string) {
    try {
      const form = unref(formRef);
      const values = await form.validate();
      const records = criteria.value.map((item) => ({
        result: values[item.id],
        inspection_criteria_id: item.id,
      }));
      var result = 'OK';
      if (type == 'ng') result = 'NG';
      const res = await updateApi({
        id: dataPallet.value.id,
        record: records,
        result: result,
      });
      if (res) {
        message.success('THAO TÁC THÀNH CÔNG');
        emit('success', { res: dataPallet.value, type: result });
      } else {
        message.error('THAO TÁC THẤT BẠI');
      }
      closeModal();
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  function handleChange(id, value) {
    formData.value[id] = value;
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

  function handleSuccess(value) {
    emit('success', value);
    closeModal();
  }

  function determineTypeInput(acceptablerange: any): number {
    if (acceptablerange === null) return 3;
    if (acceptablerange === 'pass_fail') return 2;
    return 1;
  }
</script>
