import { IBaseFormAttrs } from './formItemPropsConfig';

interface IBaseComponentProps {
  [key: string]: IBaseFormAttrs[];
}

type BaseFormAttrs = Omit<IBaseFormAttrs, 'tag'>;

export const baseComponentControlAttrs: Omit<IBaseFormAttrs, 'tag'>[] = [
  {
    // Controls without the disabled property cannot be used as form controls
    name: 'disabled',
    label: 'Disabled',
  },
  {
    // Controls without the disabled property cannot be used as form controls
    name: 'autofocus',
    label: 'Autofocus',
    includes: [
      'Input',
      'Select',
      'InputTextArea',
      'InputNumber',
      'DatePicker',
      'RangePicker',
      'MonthPicker',
      'TimePicker',
      'Cascader',
      'TreeSelect',
      'Switch',
      'AutoComplete',
      'Slider',
    ],
  },
  {
    name: 'allowClear',
    label: 'Allow Clear',
    includes: [
      'Input',
      'Select',
      'InputTextArea',
      'InputNumber',
      'DatePicker',
      'RangePicker',
      'MonthPicker',
      'TimePicker',
      'Cascader',
      'TreeSelect',
      'AutoComplete',
    ],
  },
  { name: 'fullscreen', label: 'Fullscreen', includes: ['Calendar'] },
  {
    name: 'showSearch',
    label: 'Show Search',
    includes: ['Select', 'TreeSelect', 'Cascader', 'Transfer'],
  },
  {
    name: 'showTime',
    label: 'Show Time',
    includes: ['DatePicker', 'RangePicker', 'MonthPicker'],
  },
  {
    name: 'range',
    label: 'Range Slider',
    includes: [],
  },
  {
    name: 'allowHalf',
    label: 'Allow Half',
    includes: ['Rate'],
  },
  {
    name: 'multiple',
    label: 'Multiple Selection',
    includes: ['Select', 'TreeSelect', 'Upload'],
  },
  {
    name: 'directory',
    label: 'Directory',
    includes: ['Upload'],
  },
  {
    name: 'withCredentials',
    label: 'With Credentials',
    includes: ['Upload'],
  },
  {
    name: 'bordered',
    label: 'With Border',
    includes: ['Select', 'Input'],
  },
  {
    name: 'defaultActiveFirstOption',
    label: 'Highlight First Option',
    component: 'Checkbox',
    includes: ['Select', 'AutoComplete'],
  },
  {
    name: 'dropdownMatchSelectWidth',
    label: 'Dropdown Matches Selector Width',
    component: 'Checkbox',
    includes: ['Select', 'TreeSelect', 'AutoComplete'],
  },
];

// Common Attributes
export const baseComponentCommonAttrs: Omit<IBaseFormAttrs, 'tag'>[] = [
  {
    name: 'size',
    label: 'Size',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Large',
          value: 'large',
        },
        {
          label: 'Small',
          value: 'small',
        },
      ],
    },
    includes: ['InputNumber', 'Input', 'Cascader', 'Button'],
  },
  {
    name: 'placeholder',
    label: 'Placeholder',
    component: 'Input',
    componentProps: {
      placeholder: 'Please enter a placeholder',
    },
    includes: [
      'AutoComplete',
      'InputTextArea',
      'InputNumber',
      'Input',
      'InputTextArea',
      'Select',
      'DatePicker',
      'MonthPicker',
      'TimePicker',
      'TreeSelect',
      'Cascader',
    ],
  },
  {
    name: 'style',
    label: 'Style',
    component: 'Input',
    componentProps: {
      placeholder: 'Please enter a style',
    },
  },
  {
    name: 'open',
    label: 'Always Show Dropdown',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: 'Default',
          value: undefined,
        },
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
    includes: ['Select', 'AutoComplete'],
  },
];

const componentAttrs: IBaseComponentProps = {
  AutoComplete: [
    {
      name: 'backfill',
      label: 'Auto Backfill',
      component: 'Switch',
      componentProps: {
        span: 8,
      },
    },
    {
      name: 'defaultOpen',
      label: 'Open Dropdown by Default',
      component: 'Checkbox',
    },
  ],
  IconPicker: [
    {
      name: 'mode',
      label: 'Mode',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'ICONIFY', value: null },
          { label: 'SVG', value: 'svg' },
        ],
      },
    },
  ],

  // https://developer.mozilla.org/en/docs/Web/HTML/Element/input#%3Cinput%3E_types
  Input: [
    {
      name: 'type',
      label: 'Type',
      component: 'Select',
      componentProps: {
        options: [
          { value: 'text', label: 'Text' },
          { value: 'search', label: 'Search' },
          { value: 'number', label: 'Number' },
          { value: 'range', label: 'Number Range' },
          { value: 'password', label: 'Password' },
          { value: 'date', label: 'Date' },
          { value: 'datetime-local', label: 'Datetime (No Timezone)' },
          { value: 'time', label: 'Time' },
          { value: 'month', label: 'Month' },
          { value: 'week', label: 'Week' },
          { value: 'email', label: 'Email' },
          { value: 'url', label: 'URL' },
          { value: 'tel', label: 'Phone Number' },
          { value: 'file', label: 'File' },
          { value: 'button', label: 'Button' },
          { value: 'submit', label: 'Submit Button' },
          { value: 'reset', label: 'Reset Button' },
          { value: 'radio', label: 'Radio Button' },
          { value: 'checkbox', label: 'Checkbox' },
          { value: 'color', label: 'Color' },
          { value: 'image', label: 'Image' },
          { value: 'hidden', label: 'Hidden' },
        ],
      },
    },
    {
      name: 'defaultValue',
      label: 'Default Value',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Default Value',
      },
    },
    {
      name: 'prefix',
      label: 'Prefix',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Prefix',
      },
    },
    {
      name: 'suffix',
      label: 'Suffix',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Suffix',
      },
    },
    {
      name: 'addonBefore',
      label: 'Addon Before',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Addon Before',
      },
    },
    {
      name: 'addonAfter',
      label: 'Addon After',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Addon After',
      },
    },
    {
      name: 'maxLength',
      label: 'Max Length',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Max Length',
      },
    },
  ],

  InputNumber: [
    {
      name: 'defaultValue',
      label: 'Default Value',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Default Value',
      },
    },
    {
      name: 'min',
      label: 'Min Value',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Min Value',
      },
    },
    {
      name: 'max',
      label: 'Max Value',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Max Value',
      },
    },
    {
      name: 'precision',
      label: 'Precision',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Precision',
      },
    },
    {
      name: 'step',
      label: 'Step',
      component: 'InputNumber',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Step',
      },
    },
    {
      name: 'decimalSeparator',
      label: 'Decimal Separator',
      component: 'Input',
      componentProps: { type: 'text', placeholder: 'Enter Decimal Separator' },
    },
    {
      name: 'addonBefore',
      label: 'Addon Before',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Addon Before',
      },
    },
    {
      name: 'addonAfter',
      label: 'Addon After',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Addon After',
      },
    },
    {
      name: 'controls',
      label: 'Show Increment/Decrement Buttons',
      component: 'Checkbox',
    },
    {
      name: 'keyboard',
      label: 'Enable Keyboard Shortcuts',
      component: 'Checkbox',
    },
    {
      name: 'stringMode',
      label: 'String Mode',
      component: 'Checkbox',
    },
    {
      name: 'bordered',
      label: 'With Border',
      component: 'Checkbox',
    },
  ],
  InputTextArea: [
    {
      name: 'defaultValue',
      label: 'Default Value',
      component: 'Input',
      componentProps: {
        type: 'text',
        placeholder: 'Enter Default Value',
      },
    },
    {
      name: 'maxlength',
      label: 'Max Length',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Max Length',
      },
    },
    {
      name: 'minlength',
      label: 'Min Length',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Min Length',
      },
    },
    {
      name: 'cols',
      label: 'Visible Columns',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Visible Columns',
        min: 0,
      },
    },
    {
      name: 'rows',
      label: 'Visible Rows',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Visible Rows',
        min: 0,
      },
    },
    {
      name: 'autosize',
      label: 'Auto Resize Based on Content',
      component: 'Checkbox',
    },
    {
      name: 'showCount',
      label: 'Show Word Count',
      component: 'Checkbox',
    },
    {
      name: 'readonly',
      label: 'Read-Only',
      component: 'Checkbox',
    },
    {
      name: 'spellcheck',
      label: 'Spell Check',
      component: 'Checkbox',
    },
    {
      name: 'autocomplete',
      label: 'Autocomplete',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'Normal', value: null },
          { label: 'On', value: 'on' },
          { label: 'Off', value: 'off' },
        ],
      },
    },
    {
      name: 'autocorrect',
      label: 'Autocorrect',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'Normal', value: null },
          { label: 'On', value: 'on' },
          { label: 'Off', value: 'off' },
        ],
      },
    },
  ],
  Select: [
    {
      name: 'mode',
      label: 'Select Mode (Default: Single)',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'Single', value: null },
          { label: 'Multiple', value: 'multiple' },
          { label: 'Tags', value: 'tags' },
        ],
      },
    },
    {
      name: 'autoClearSearchValue',
      label: 'Clear Search Box After Selecting',
      component: 'Checkbox',
    },
    {
      name: 'labelInValue',
      label: 'Include Label in Value',
      component: 'Checkbox',
    },
    {
      name: 'showArrow',
      label: 'Show Dropdown Arrow',
      component: 'Checkbox',
    },
    {
      name: 'defaultOpen',
      label: 'Open Dropdown by Default',
      component: 'Checkbox',
    },
  ],
  Checkbox: [
    {
      name: 'indeterminate',
      label: 'Set Indeterminate State',
      component: 'Checkbox',
    },
  ],
  CheckboxGroup: [],
  RadioGroup: [
    {
      name: 'defaultValue',
      label: 'Default Value',
      component: 'Input',
      componentProps: {
        placeholder: 'Enter Default Value',
      },
    },
    {
      name: 'buttonStyle',
      label: 'RadioButton Style',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Outline',
            value: 'outline',
          },
          {
            label: 'Solid',
            value: 'solid',
          },
        ],
      },
    },
    {
      name: 'optionType',
      label: 'Option Type',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Default',
            value: 'default',
          },
          {
            label: 'Button',
            value: 'button',
          },
        ],
      },
    },
    {
      name: 'size',
      label: 'Size',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Default',
            value: 'default',
          },
          {
            label: 'Large',
            value: 'large',
          },
          {
            label: 'Small',
            value: 'small',
          },
        ],
      },
    },
  ],
  DatePicker: [
    {
      name: 'format',
      label: 'Display Format',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM-DD',
      },
    },
    {
      name: 'valueFormat',
      label: 'Value Format',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM-DD',
      },
    },
  ],
  RangePicker: [
    {
      name: 'placeholder',
      label: 'Placeholder',
      children: [
        {
          name: '',
          label: '',
          component: 'Input',
        },
        {
          name: '',
          label: '',
          component: 'Input',
        },
      ],
    },
    {
      name: 'format',
      label: 'Display Format',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      name: 'valueFormat',
      label: 'Value Format',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM-DD',
      },
    },
  ],
  MonthPicker: [
    {
      name: 'format',
      label: 'Display Format',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM',
      },
    },
    {
      name: 'valueFormat',
      label: 'Value Format',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM',
      },
    },
  ],
  TimePicker: [
    {
      name: 'format',
      label: 'Display Format',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM',
      },
    },
    {
      name: 'valueFormat',
      label: 'Value Format',
      component: 'Input',
      componentProps: {
        placeholder: 'YYYY-MM',
      },
    },
  ],
  Slider: [
    {
      name: 'defaultValue',
      label: 'Default Value',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Default Value',
      },
    },
    {
      name: 'min',
      label: 'Min Value',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Min Value',
      },
    },
    {
      name: 'max',
      label: 'Max Value',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Max Value',
      },
    },
    {
      name: 'step',
      label: 'Step',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Step',
      },
    },
    {
      name: 'tooltipPlacement',
      label: 'Tooltip Placement',
      component: 'Select',
      componentProps: {
        options: [
          { value: 'top', label: 'Top' },
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
          { value: 'bottom', label: 'Bottom' },
          { value: 'topLeft', label: 'Top Right' },
          { value: 'topRight', label: 'Top Left' },
          { value: 'bottomLeft', label: 'Bottom Right' },
          { value: 'bottomRight', label: 'Bottom Left' },
          { value: 'leftTop', label: 'Left Bottom' },
          { value: 'leftBottom', label: 'Left Top' },
          { value: 'rightTop', label: 'Right Bottom' },
          { value: 'rightBottom', label: 'Right Top' },
        ],
      },
    },
    {
      name: 'tooltipVisible',
      label: 'Always Show Tooltip',
      component: 'Checkbox',
    },
    {
      name: 'dots',
      label: 'Snap to Ticks',
      component: 'Checkbox',
    },
    {
      name: 'range',
      label: 'Range Slider',
      component: 'Checkbox',
    },
    {
      name: 'reverse',
      label: 'Reverse Axis',
      component: 'Checkbox',
    },
    {
      name: 'vertical',
      label: 'Vertical Direction',
      component: 'Checkbox',
    },
    {
      name: 'included',
      label: 'Include Value',
      component: 'Checkbox',
    },
  ],
  Rate: [
    {
      name: 'defaultValue',
      label: 'Default Value',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Default Value',
      },
    },
    {
      name: 'character',
      label: 'Custom Character',
      component: 'Input',
      componentProps: {
        placeholder: 'Enter Custom Character',
      },
    },
    {
      name: 'count',
      label: 'Total Stars',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Total Stars',
      },
    },
  ],
  Switch: [
    {
      name: 'checkedChildren',
      label: 'Checked Content',
      component: 'Input',
      componentProps: {
        placeholder: 'Enter Checked Content',
      },
    },
    {
      name: 'checkedValue',
      label: 'Checked Value',
      component: 'Input',
      componentProps: {
        placeholder: 'Enter Checked Value',
      },
    },
    {
      name: 'unCheckedChildren',
      label: 'Unchecked Content',
      component: 'Input',
      componentProps: {
        placeholder: 'Enter Unchecked Content',
      },
    },
    {
      name: 'unCheckedValue',
      label: 'Unchecked Value',
      component: 'Input',
      componentProps: {
        placeholder: 'Enter Unchecked Value',
      },
    },
    {
      name: 'loading',
      label: 'Loading Switch',
      component: 'Checkbox',
    },
    {
      name: 'size',
      label: 'Size',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Default',
            value: 'default',
          },
          {
            label: 'Small',
            value: 'small',
          },
        ],
      },
    },
  ],
  TreeSelect: [
    {
      name: 'defaultValue',
      label: 'Default Value',
      component: 'Input',
      componentProps: {
        placeholder: 'Enter Default Value',
      },
    },
    {
      name: 'searchPlaceholder',
      label: 'Search Box Placeholder',
      component: 'Input',
      componentProps: {
        placeholder: 'Enter Search Box Placeholder',
      },
    },
    {
      name: 'treeNodeFilterProp',
      label: 'Property for Filtering TreeNode',
      component: 'Input',
      componentProps: {
        defaultValue: 'value',
      },
    },
    {
      name: 'treeNodeLabelProp',
      label: 'Property for TreeNode Label',
      component: 'Input',
      componentProps: {
        defaultValue: 'title',
      },
    },
    {
      name: 'popupClassName',
      label: 'Dropdown Menu Class Name',
      component: 'Input',
      componentProps: {
        placeholder: 'Enter Dropdown Menu Class Name',
      },
    },
    {
      name: 'labelInValue',
      label: 'Include Label in Value',
      component: 'Checkbox',
    },
    {
      name: 'treeIcon',
      label: 'Show Icon Before TreeNode Title',
      component: 'Checkbox',
    },
    {
      name: 'treeCheckable',
      label: 'Checkable TreeNode',
      component: 'Checkbox',
    },
    {
      name: 'treeCheckStrictly',
      label: 'Fully Controlled Node Selection',
      component: 'Checkbox',
    },
    {
      name: 'treeDefaultExpandAll',
      label: 'Expand All Nodes by Default',
      component: 'Checkbox',
    },
    {
      name: 'treeLine',
      label: 'Show Line Style',
      component: 'Checkbox',
    },
    {
      name: 'maxTagCount',
      label: 'Max Number of Tags to Display',
      component: 'InputNumber',
      componentProps: {
        placeholder: 'Enter Max Number of Tags',
      },
    },
    {
      name: 'size',
      label: 'Size',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Default',
            value: 'default',
          },
          {
            label: 'Small',
            value: 'small',
          },
        ],
      },
    },
  ],
  Cascader: [
    {
      name: 'expandTrigger',
      label: 'Submenu Trigger Method (Default: Click)',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Click',
            value: 'click',
          },
          {
            label: 'Hover',
            value: 'hover',
          },
        ],
      },
    },
  ],
  Button: [
    {
      name: 'type',
      label: 'Type',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Default',
            value: 'default',
          },
          {
            label: 'Primary',
            value: 'primary',
          },
          {
            label: 'Danger',
            value: 'danger',
          },
          {
            label: 'Dashed',
            value: 'dashed',
          },
        ],
      },
    },
    {
      name: 'handle',
      label: 'Action',
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'Submit',
            value: 'submit',
          },
          {
            label: 'Reset',
            value: 'reset',
          },
        ],
      },
    },
  ],
  Upload: [
    {
      name: 'action',
      label: 'Upload URL',
      component: 'Input',
    },
    {
      name: 'name',
      label: 'File Parameter Name (name)',
      component: 'Input',
    },
  ],
  slot: [
    {
      name: 'slotName',
      label: 'Slot Name',
      component: 'Input',
    },
  ],
  Transfer: [
    {
      name: 'oneWay',
      label: 'Show as One-Way',
      component: 'Checkbox',
    },
    {
      name: 'pagination',
      label: 'Use Pagination Style',
      component: 'Checkbox',
    },
    {
      name: 'showSelectAll',
      label: 'Show Select All Checkbox',
      component: 'Checkbox',
    },
  ],
};

function deleteProps(list: Omit<IBaseFormAttrs, 'tag'>[], key: string) {
  list.forEach((element, index) => {
    if (element.name === key) {
      list.splice(index, 1);
    }
  });
}

componentAttrs['StrengthMeter'] = componentAttrs['Input'];
componentAttrs['StrengthMeter'].push({
  name: 'visibilityToggle',
  label: 'Show Toggle Button',
  component: 'Checkbox',
});

deleteProps(componentAttrs['StrengthMeter'], 'type');
deleteProps(componentAttrs['StrengthMeter'], 'prefix');
deleteProps(componentAttrs['StrengthMeter'], 'defaultValue');
deleteProps(componentAttrs['StrengthMeter'], 'suffix');
// Component Attributes
// name: Control's attribute
export const baseComponentAttrs: IBaseComponentProps = componentAttrs;

// Find the required configuration item in all options
const findCompoentProps = (props, name) => {
  const idx = props.findIndex((value: BaseFormAttrs) => {
    return value.name === name;
  });
  if (props[idx] && props[idx].componentProps) {
    return props[idx].componentProps;
  }
};

// Update the control's configuration based on the value of other options
export const componentPropsFuncs = {
  RadioGroup: (compProp, options: BaseFormAttrs[]) => {
    const props = findCompoentProps(options, 'size');
    if (props) {
      if (compProp['optionType'] && compProp['optionType'] != 'button') {
        props['disabled'] = true;
        compProp['size'] = null;
      } else {
        props['disabled'] = false;
      }
    }
  },
};
