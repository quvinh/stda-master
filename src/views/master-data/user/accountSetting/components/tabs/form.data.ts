import { FormSchema } from '@/components/Form';

export const formSchema: FormSchema[] = [
  {
    field: 'oldPass',
    label: 'Mật khẩu hiện tại',
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'newPass',
    label: 'Mật khẩu mới',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: 'Vui lòng nhập mật khẩu mới',
    },
    rules: [
      {
        required: true,
        message: 'Vui lòng nhập mật khẩu mới',
      },
    ],
  },
  {
    field: 'confirmPass',
    label: 'Xác nhận mật khẩu',
    component: 'InputPassword',

    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('Mật khẩu không thể trống');
            }
            if (value !== values.newPass) {
              return Promise.reject('Mật khẩu xác nhận không nhất quán!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];

export const formInfoSchema: FormSchema[] = [
  {
    field: 'photo',
    label: 'Ảnh đại diện',
    slot: 'photo',
  },
  {
    field: 'name',
    label: 'Họ tên',
    component: 'Input',
    required: true,
  },
  // {
  //   field: 'phone',
  //   label: 'Số điện thoại',
  //   component: 'Input',
  //   required: true,
  // },
  {
    field: 'email',
    label: 'Email',
    component: 'Input',
    required: true,
    rules: [{ type: 'email' }],
  },
  // {
  //   field: 'address',
  //   label: 'Địa chỉ',
  //   component: 'InputTextArea',
  // },
];
