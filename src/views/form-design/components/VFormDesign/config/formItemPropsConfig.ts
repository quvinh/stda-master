import { IAnyObject } from '../../../typings/base-type';
import { baseComponents, customComponents } from '../../../core/formItemConfig';
import { Input, Select, RadioGroup, Slider } from 'ant-design-vue';
import { Component } from 'vue';

export const globalConfigState: { span: number } = {
  span: 24,
};
export interface IBaseFormAttrs {
  name: string; // Field name
  label: string; // Field label
  component?: string | Component; // Component for the property
  componentProps?: IAnyObject; // Properties passed to the component
  exclude?: string[]; // Components to exclude
  includes?: string[]; // Components that meet the criteria
  on?: IAnyObject;
  children?: IBaseFormAttrs[];
  category?: 'control' | 'input';
}

export interface IBaseFormItemControlAttrs extends IBaseFormAttrs {
  target?: 'props' | 'options'; // Bound to a target key within an object
}

export const baseItemColumnProps: IBaseFormAttrs[] = [
  {
    name: 'span',
    label: 'Number of grid columns',
    component: 'Slider',
    on: {
      change(value: number) {
        globalConfigState.span = value;
      },
    },
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'offset',
    label: 'Number of grid columns to offset from the left',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'order',
    label: 'Grid order, effective in flex layout mode',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'pull',
    label: 'Number of grid columns to pull to the left',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'push',
    label: 'Number of grid columns to push to the right',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'xs',
    label: 'Responsive grid <576px',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'sm',
    label: 'Responsive grid ≥576px',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'md',
    label: 'Responsive grid ≥768px',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'lg',
    label: 'Responsive grid ≥992px',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'xl',
    label: 'Responsive grid ≥1200px',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'xxl',
    label: 'Responsive grid ≥1600px',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: '≥2000px',
    label: 'Responsive grid ≥2000px',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
];

// Configuration options for the control attribute panel
export const advanceFormItemColProps: IBaseFormAttrs[] = [
  {
    name: 'labelCol',
    label: 'Label col',
    component: Slider,
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
    exclude: ['Grid'],
  },
  {
    name: 'wrapperCol',
    label: 'Control span',
    component: Slider,
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
    exclude: ['Grid'],
  },
];

// Configuration options for the control attribute panel
export const baseFormItemProps: IBaseFormAttrs[] = [
  {
    // Dynamically switch the type of control
    name: 'component',
    label: 'Component - FormItem',
    component: Select,
    componentProps: {
      options: baseComponents
        .concat(customComponents)
        .map((item) => ({ value: item.component, label: item.label })),
    },
  },
  {
    name: 'label',
    label: 'Label',
    component: Input,
    componentProps: {
      type: 'Input',
      placeholder: 'Please enter a label',
    },
    exclude: ['Grid'],
  },
  {
    name: 'field',
    label: 'Field Identifier',
    component: Input,
    componentProps: {
      type: 'InputTextArea',
      placeholder: 'Please enter a field identifier',
    },
    exclude: ['Grid'],
  },
  {
    name: 'helpMessage',
    label: 'Help Message',
    component: Input,
    componentProps: {
      placeholder: 'Please enter help information',
    },
    exclude: ['Grid'],
  },
];

// Configuration options for the control attribute panel
export const advanceFormItemProps: IBaseFormAttrs[] = [
  {
    name: 'labelAlign',
    label: 'Label Alignment',
    component: RadioGroup,
    componentProps: {
      options: [
        {
          label: 'Left Align',
          value: 'left',
        },
        {
          label: 'Right Align',
          value: 'right',
        },
      ],
    },
    exclude: ['Grid'],
  },

  {
    name: 'help',
    label: 'Help',
    component: Input,
    componentProps: {
      placeholder: 'Please enter help information',
    },
    exclude: ['Grid'],
  },
  {
    name: 'extra',
    label: 'Extra Message',
    component: Input,
    componentProps: {
      type: 'InputTextArea',
      placeholder: 'Please enter extra message',
    },
    exclude: ['Grid'],
  },
  {
    name: 'validateTrigger',
    label: 'Validate Trigger',
    component: Input,
    componentProps: {
      type: 'InputTextArea',
      placeholder: 'Please enter validate trigger',
    },
    exclude: ['Grid'],
  },
  {
    name: 'validateStatus',
    label: 'Validation Status',
    component: RadioGroup,
    componentProps: {
      options: [
        {
          label: 'Default',
          value: '',
        },
        {
          label: 'Success',
          value: 'success',
        },
        {
          label: 'Warning',
          value: 'warning',
        },
        {
          label: 'Error',
          value: 'error',
        },
        {
          label: 'Validating',
          value: 'validating',
        },
      ],
    },
    exclude: ['Grid'],
  },
];

export const baseFormItemControlAttrs: IBaseFormItemControlAttrs[] = [
  {
    name: 'required',
    label: 'Required',
    component: 'Checkbox',
    exclude: ['alert'],
  },
  {
    name: 'hidden',
    label: 'Hidden',
    component: 'Checkbox',
    exclude: ['alert'],
  },
  {
    name: 'hiddenLabel',
    component: 'Checkbox',
    exclude: ['Grid'],
    label: 'Hide Label',
  },
  {
    name: 'colon',
    label: 'Show colon after label',
    component: 'Checkbox',
    componentProps: {},
    exclude: ['Grid'],
  },
  {
    name: 'hasFeedback',
    label: 'Input Feedback',
    component: 'Checkbox',
    componentProps: {},
    includes: ['Input'],
  },
  {
    name: 'autoLink',
    label: 'Auto Link',
    component: 'Checkbox',
    componentProps: {},
    includes: ['Input'],
  },
  {
    name: 'validateFirst',
    label: 'Stop Validation on First Error',
    component: 'Checkbox',
    componentProps: {},
    includes: ['Input'],
  },
];
