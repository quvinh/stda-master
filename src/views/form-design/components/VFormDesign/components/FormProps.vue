<!--
 * @Description: 右侧属性面板控件 表单属性面板
-->
<template>
  <div class="properties-content">
    <Form class="properties-body" label-align="left" layout="vertical">
      <!--      <e-upload v-model="fileList"></e-upload>-->

      <FormItem label="Form Layout">
        <RadioGroup button-style="solid" v-model:value="formConfig.layout">
          <RadioButton value="horizontal">Horizontal</RadioButton>
          <RadioButton value="vertical" :disabled="formConfig.labelLayout === 'Grid'">
            Vertical
          </RadioButton>
          <RadioButton value="inline" :disabled="formConfig.labelLayout === 'Grid'">
            Inline
          </RadioButton>
        </RadioGroup>
      </FormItem>

      <!-- <Row> -->
      <FormItem label="Label Layout">
        <RadioGroup
          buttonStyle="solid"
          v-model:value="formConfig.labelLayout"
          @change="lableLayoutChange"
        >
          <RadioButton value="flex">Fixed</RadioButton>
          <RadioButton value="Grid" :disabled="formConfig.layout !== 'horizontal'">
            Grid
          </RadioButton>
        </RadioGroup>
      </FormItem>
      <!-- </Row> -->
      <FormItem label="Label Width (px)" v-show="formConfig.labelLayout === 'flex'">
        <InputNumber
          :style="{ width: '100%' }"
          v-model:value="formConfig.labelWidth"
          :min="0"
          :step="1"
        />
      </FormItem>
      <div v-if="formConfig.labelLayout === 'Grid'">
        <FormItem label="labelCol">
          <Slider v-model:value="sliderSpan" :max="24" />
        </FormItem>
        <FormItem label="wrapperCol">
          <Slider v-model:value="sliderSpan" :max="24" />
        </FormItem>

        <FormItem label="Label Alignment">
          <RadioGroup button-style="solid" v-model:value="formConfig.labelAlign">
            <RadioButton value="left">Left Align</RadioButton>
            <RadioButton value="right">Right Align</RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem label="Control Size">
          <RadioGroup button-style="solid" v-model:value="formConfig.size">
            <RadioButton value="default">Default</RadioButton>
            <RadioButton value="small">Small</RadioButton>
            <RadioButton value="large">Large</RadioButton>
          </RadioGroup>
        </FormItem>
      </div>

      <FormItem label="Form Properties">
        <Col>
          <Checkbox v-model:checked="formConfig.colon" v-if="formConfig.layout === 'horizontal'">
            Show colon after label
          </Checkbox>
        </Col>
        <Col>
          <Checkbox v-model:checked="formConfig.disabled">Disabled</Checkbox>
        </Col>
        <Col>
          <Checkbox v-model:checked="formConfig.hideRequiredMark">Hide required mark</Checkbox>
        </Col>
      </FormItem>
    </Form>
  </div>
</template>
<script lang="ts" setup name="FormProps">
  import { computed } from 'vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import {
    InputNumber,
    Slider,
    Checkbox,
    Col,
    RadioChangeEvent,
    Form,
    FormItem,
    RadioButton,
    RadioGroup,
  } from 'ant-design-vue';

  const { formConfig } = useFormDesignState();

  formConfig.value = formConfig.value || {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const lableLayoutChange = (e: RadioChangeEvent) => {
    if (e.target.value === 'Grid') {
      formConfig.value.layout = 'horizontal';
    }
  };

  const sliderSpan = computed(() => {
    if (formConfig.value.labelLayout) {
      return Number(formConfig.value.labelCol!.span);
    }
    return 0;
  });
</script>
