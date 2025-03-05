<!--
 * @Description: Regular Expression Validation Options Component
-->
<template>
  <div class="rule-props-content">
    <Form
      v-if="formConfig.currentItem && formConfig.currentItem['rules']"
      layout="vertical"
      size="small"
    >
      <div
        v-for="(item, index) of formConfig.currentItem['rules']"
        :key="index"
        class="rule-props-item"
      >
        <Icon
          icon="ant-design:close-circle-filled"
          class="rule-props-item-close"
          @click="removeRule(index)"
        />
        <div>
          <FormItem label="Pattern" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
            <AutoComplete
              v-model:value="item.pattern"
              placeholder="Please enter regular expression"
              :dataSource="patternDataSource"
              :dropdown-match-select-width="false"
            />
          </FormItem>
          <FormItem label="Message" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
            <Input v-model:value="item.message" placeholder="Please enter message" />
          </FormItem>
        </div>
      </div>
    </Form>
    <a @click="addRules">
      <Icon icon="ant-design:file-add-outlined" />
      Add Regular Expression
    </a>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue';
  import { remove } from '../../../utils';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { isArray } from 'lodash-es';
  import { Form, FormItem, AutoComplete, Input } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  export default defineComponent({
    name: 'RuleProps',
    components: {
      Form,
      FormItem,
      AutoComplete,
      Input,
      Icon,
    },
    setup() {
      // Get the state of the ancestor component
      const { formConfig } = useFormDesignState();
      // Extract currentItem
      /**
       * Add regular expression validation. Check if the current component's rules are an array. If not, use the set method to reset it to an array, and then add the regular expression validation.
       */
      const addRules = () => {
        if (!isArray(formConfig.value.currentItem!.rules))
          formConfig.value.currentItem!['rules'] = [];
        formConfig.value.currentItem!.rules?.push({ pattern: '', message: '' });
      };

      /**
       * Remove a regular expression validation. When the regular expression rules count reaches 0, delete the rules property.
       * @param index {number} The index of the rule to remove
       */
      const removeRule = (index: number) => {
        remove(formConfig.value.currentItem!.rules as Array<any>, index);
        if (formConfig.value.currentItem!.rules?.length === 0)
          delete formConfig.value.currentItem!['rules'];
      };

      const patternDataSource = ref([
        {
          value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
          text: 'Mobile Phone Number',
        },
        {
          value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
          text: 'URL with Port Number',
        },
        {
          value:
            '/^(((ht|f)tps?):\\/\\/)?[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-\\(\\)]*[\\w@?^=%&/~+#-\\(\\)])?$/',
          text: 'URL with Parameters',
        },
        {
          value: '/^[0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/',
          text: 'Unified Social Credit Code',
        },
        {
          value: '/^(s[hz]|S[HZ])(000[\\d]{3}|002[\\d]{3}|300[\\d]{3}|600[\\d]{3}|60[\\d]{4})$/',
          text: 'Stock Code',
        },
        {
          value: '/^([a-f\\d]{32}|[A-F\\d]{32})$/',
          text: 'MD5 Format (32 characters)',
        },
        {
          value: '/^[a-f\\d]{4}(?:[a-f\\d]{4}-){4}[a-f\\d]{12}$/i',
          text: 'GUID/UUID',
        },
        {
          value: '/^\\d+(?:\\.\\d+){2}$/',
          text: 'Version Number (x.y.z) Format',
        },
        {
          value:
            '/^https?:\\/\\/(.+\\/)+.+(\\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$/i',
          text: 'Video URL',
        },
        {
          value: '/^https?:\\/\\/(.+\\/)+.+(\\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i',
          text: 'Image URL',
        },
        {
          value: '/^-?\\d+(,\\d{3})*(\\.\\d{1,2})?$/',
          text: 'Number/Currency Amount (supports negative values and thousand separators)',
        },
        {
          value:
            '/(?:^[1-9]([0-9]+)?(?:\\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\\.[0-9](?:[0-9])?$)/',
          text: 'Number/Currency Amount',
        },
        {
          value: '/^[1-9]\\d{9,29}$/',
          text: 'Bank Account Number',
        },
        {
          value: '/^(?:[\u4e00-\u9fa5·]{2,16})$/',
          text: 'Chinese Name',
        },
        {
          value: '/(^[a-zA-Z][a-zA-Z\\s]{0,20}[a-zA-Z]$)/',
          text: 'English Name',
        },
        {
          value:
            '/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z](?:((\\d{5}[A-HJK])|([A-HJK][A-HJ-NP-Z0-9][0-9]{4}))|[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳])$/',
          text: 'License Plate Number (New Energy)',
        },
        {
          value:
            '/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]$/',
          text: 'License Plate Number (Non-New Energy)',
        },
        {
          value:
            '/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/',
          text: 'License Plate Number (New Energy + Non-New Energy)',
        },
        {
          value:
            '/^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/',
          text: 'Email',
        },
        {
          value: '/^(?:(?:\\d{3}-)?\\d{8}|^(?:\\d{4}-)?\\d{7,8})(?:-\\d+)?$/',
          text: 'Landline',
        },
        {
          value:
            '/^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$/',
          text: 'ID Card Number',
        },
        {
          value:
            '/(^[EeKkGgDdSsPpHh]\\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\\d{7}$)/',
          text: 'Passport',
        },
        {
          value:
            '/^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/',
          text: 'Chinese Characters',
        },
        {
          value: '/^\\d+\\.\\d+$/',
          text: 'Decimal',
        },
        {
          value: '/^\\d{1,}$/',
          text: 'Number',
        },
        {
          value: '/^[1-9][0-9]{4,10}$/',
          text: 'QQ Number',
        },
        {
          value: '/^[A-Za-z0-9]+$/',
          text: 'Alphanumeric Combination',
        },
        {
          value: '/^[a-zA-Z]+$/',
          text: 'English Letters',
        },
        {
          value: '/^[a-z]+$/',
          text: 'Lowercase Letters',
        },
        {
          value: '/^[A-Z]+$/',
          text: 'Uppercase Letters',
        },
        {
          value: '/^[a-zA-Z0-9_-]{4,16}$/',
          text: 'Username Validation (4 to 16 characters: letters, numbers, underscores, hyphens)',
        },
        {
          value: '/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/',
          text: 'Hexadecimal Color',
        },
        {
          value: '/^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/',
          text: 'WeChat ID',
        },
        {
          value: '/^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\\d{4}$/',
          text: 'Postal Code (China)',
        },
        {
          value: '/^[^A-Za-z]*$/',
          text: 'Cannot Contain Letters',
        },
        {
          value: '/^\\+?[1-9]\\d*$/',
          text: 'Positive Integer (Excludes 0)',
        },
        {
          value: '/^-[1-9]\\d*$/',
          text: 'Negative Integer (Excludes 0)',
        },
        {
          value: '/^-?[0-9]\\d*$/',
          text: 'Integer',
        },
        {
          value: '/^(-?\\d+)(\\.\\d+)?$/',
          text: 'Floating Point Number',
        },
        {
          value: '/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$/',
          text: 'Email (Supports Chinese)',
        },
      ]);

      return { addRules, removeRule, formConfig, patternDataSource };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.icon) {
    width: 1em;
    height: 1em;
    overflow: hidden;
    fill: currentcolor;
    vertical-align: -0.15em;
  }

  .rule-props-content {
    :deep(.ant-form-item) {
      margin-bottom: 0;
    }

    .rule-props-item {
      position: relative;
      margin-bottom: 5px;
      padding: 3px 2px;
      border-radius: 0;
      background-color: #f0eded;

      :deep(.ant-form-item) {
        border: 0 !important;
      }

      &-close {
        position: absolute;
        z-index: 999;
        top: -5px;
        right: -5px;
        border-radius: 7px;
        background-color: #a3a0a0;
        color: #ccc;
        cursor: pointer;

        &:hover {
          color: #00c;
        }
      }
    }
  }
</style>
