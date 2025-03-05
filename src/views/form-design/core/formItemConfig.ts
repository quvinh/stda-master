/**
 * @description：表单配置
 */
import { IVFormComponent } from '../typings/v-form-component';
import { isArray } from 'lodash-es';
import { componentMap as VbenCmp, add } from '@/components/Form/src/componentMap';
import { ComponentType } from '@/components/Form/src/types';

import { componentMap as Cmp } from '../components';
import { Component } from 'vue';

const componentMap = new Map<string, Component>();

//如果有其它控件，可以在这里初始化

//注册Ant控件库
Cmp.forEach((value, key) => {
  componentMap.set(key, value);
  if (VbenCmp[key] == null) {
    add(key as ComponentType, value);
  }
});
//注册vben控件库
VbenCmp.forEach((value, key) => {
  componentMap.set(key, value);
});

export { componentMap };

/**
 * 设置自定义表单控件
 * @param {IVFormComponent | IVFormComponent[]} config
 */
export function setFormDesignComponents(config: IVFormComponent | IVFormComponent[]) {
  if (isArray(config)) {
    config.forEach((item) => {
      const { componentInstance: component, ...rest } = item;
      componentMap[item.component] = component;
      customComponents.push(Object.assign({ props: {} }, rest));
    });
  } else {
    const { componentInstance: component, ...rest } = config;
    componentMap[config.component] = component;
    customComponents.push(Object.assign({ props: {} }, rest));
  }
}

// Externally set custom controls
export const customComponents: IVFormComponent[] = [
  // {
  //   field: '',
  //   component: 'Table',
  //   label: 'Table',
  //   icon: 'icon-grid',
  //   componentProps: {},
  //   columns: [
  //     {
  //       span: 12,
  //       children: [],
  //     },
  //     {
  //       span: 12,
  //       children: [],
  //     },
  //   ],
  //   colProps: { span: 24 },
  //   options: {
  //     gutter: 0,
  //   },
  // },
];

// The control list on the left and the initialized control properties
// props.slotName will generate a slot at the formitem level and bind the current record value
// The property props is of object type and cannot be undefined or null.
export const baseComponents: IVFormComponent[] = [
  {
    component: 'InputCountDown',
    label: 'Countdown',
    icon: 'line-md:iconify2',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
  },
  {
    component: 'IconPicker',
    label: 'Icon Picker',
    icon: 'line-md:iconify2',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
  },
  {
    component: 'StrengthMeter',
    label: 'Password',
    icon: 'wpf:password1',
    colProps: { span: 24 },
    field: '',
    componentProps: {},
  },
  {
    component: 'AutoComplete',
    label: 'Auto Comp',
    icon: 'wpf:password1',
    colProps: { span: 24 },
    field: '',
    componentProps: {
      placeholder: 'Please enter a regular expression',
      options: [
        {
          value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
          label: 'Phone Number',
        },
        {
          value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
          label: 'URL with Port Number',
        },
      ],
    },
  },
  {
    component: 'Divider',
    label: 'Divider',
    icon: 'radix-icons:divider-horizontal',
    colProps: { span: 24 },
    field: '',
    componentProps: {
      orientation: 'center',
      dashed: true,
    },
  },
  {
    component: 'Checkbox',
    label: 'Checkbox',
    icon: 'ant-design:check-circle-outlined',
    colProps: { span: 24 },
    field: '',
  },
  {
    component: 'CheckboxGroup',
    label: 'Ckb Group',
    icon: 'ant-design:check-circle-filled',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: 'Option 1',
          value: '1',
        },
        {
          label: 'Option 2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'Input',
    label: 'Input',
    icon: 'bi:input-cursor-text',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      type: 'text',
    },
  },
  {
    component: 'InputNumber',
    label: 'Input Num',
    icon: 'ant-design:field-number-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: { style: 'width:200px' },
  },
  {
    component: 'InputTextArea',
    label: 'Text Area',
    icon: 'ant-design:file-text-filled',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Select',
    label: 'Select',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: 'Option 1',
          value: '1',
        },
        {
          label: 'Option 2',
          value: '2',
        },
      ],
    },
  },

  {
    component: 'Radio',
    label: 'Radio',
    icon: 'ant-design:check-circle-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'RadioGroup',
    label: 'Radio Group',
    icon: 'carbon:radio-button-checked',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: 'Option 1',
          value: '1',
        },
        {
          label: 'Option 2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'DatePicker',
    label: 'Date Picker',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'RangePicker',
    label: 'Range Picker',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      placeholder: ['Start Date', 'End Date'],
    },
  },
  {
    component: 'MonthPicker',
    label: 'Month Picker',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      placeholder: 'Please select a month',
    },
  },
  {
    component: 'TimePicker',
    label: 'Time Picker',
    icon: 'healthicons:i-schedule-school-date-time',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Slider',
    label: 'Slider',
    icon: 'vaadin:slider',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Rate',
    label: 'Rate',
    icon: 'ic:outline-star-rate',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'Switch',
    label: 'Switch',
    icon: 'entypo:switch',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'TreeSelect',
    label: 'Tree Select',
    icon: 'clarity:tree-view-line',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      treeData: [
        {
          label: 'Option 1',
          value: '1',
          children: [
            {
              label: 'Option 1-1',
              value: '1-1',
            },
          ],
        },
        {
          label: 'Option 2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'Upload',
    label: 'Upload',
    icon: 'ant-design:upload-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      api: () => 1,
    },
  },
  {
    component: 'Cascader',
    label: 'Cascader',
    icon: 'ant-design:check-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: 'Option 1',
          value: '1',
          children: [
            {
              label: 'Option 1-1',
              value: '1-1',
            },
          ],
        },
        {
          label: 'Option 2',
          value: '2',
        },
      ],
    },
  },
  {
    component: 'slot',
    label: 'Slot',
    icon: 'vs:timeslot-question',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      slotName: 'slotName',
    },
  },
];

// https://next.antdv.com/components/transfer-cn
const transferControl = {
  component: 'Transfer',
  label: 'Transfer Box',
  icon: 'bx:bx-transfer-alt',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    render: (item) => item.title,
    dataSource: [
      {
        key: 'key-1',
        title: 'Title 1',
        description: 'Description',
        disabled: false,
        chosen: true,
      },
      {
        key: 'key-2',
        title: 'Title 2',
        description: 'Description 2',
        disabled: true,
      },
      {
        key: 'key-3',
        title: 'Title 3',
        description: 'Description 3',
        disabled: false,
        chosen: true,
      },
    ],
  },
};

baseComponents.push(transferControl);

export const layoutComponents: IVFormComponent[] = [
  {
    field: '',
    component: 'Grid',
    label: 'Grid layout',
    icon: 'icon-grid',
    componentProps: {},
    columns: [
      {
        span: 12,
        children: [],
      },
      {
        span: 12,
        children: [],
      },
    ],
    colProps: { span: 24 },
    options: {
      gutter: 0,
    },
  },
];
