<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { IProductionOrder } from '@/api/model/IProductionOrder';
  import { createProductOrderApi, updateProductOrderApi } from '@/api/sys/production-order';
  import { searchProductApi } from '@/api/sys/product';
  import { searchProcessApi } from '@/api/sys/process';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import dayjs from 'dayjs';
  import { computed, ref, unref } from 'vue';
  import { searchCustomerApi } from '@/api/sys/customer';

  const emit = defineEmits(['success']);
  const { createMessage: msg } = useMessage();
  const productOptions = ref<{ label: string; value: string }[]>([]);
  const processOptions = ref<{ label: string; value: string }[]>([]);
  const customerOptions = ref<{ label: string; value: string }[]>([]);

  const record = ref<IProductionOrder>();
  const isUpdate = ref<boolean>(true);

  const getFormSchema: FormSchema[] = [
    // {
    //   field: 'product_id',
    //   label: 'Sản phẩm',
    //   component: 'Select',
    //   colProps: { span: 24 },
    //   componentProps: {
    //     options: productOptions.value,
    //     allowClear: true,
    //   },
    // },
    {
      field: 'customer_id',
      label: 'Mã khách hàng',
      component: 'Select',
      colProps: { span: 24 },
      componentProps: {
        options: customerOptions.value,
        allowClear: true,
      },
      required: true,
    },
    {
      field: 'order_date',
      label: 'Ngày nhận đơn',
      component: 'DatePicker',
      colProps: { span: 12 },
      componentProps: {
        class: 'w-full',
        // showTime: { format: 'HH:mm:ss' }, // Hiển thị phần chọn giờ
        format: 'DD/MM/YYYY', // Định dạng cho ngày và giờ
        allowClear: true, // Cho phép xóa giá trị
      },
      required: true,
    },
    {
      field: 'delivery_date',
      label: 'Ngày giao hàng',
      component: 'DatePicker',
      colProps: { span: 12 },
      componentProps: {
        class: 'w-full',
        // showTime: { format: 'HH:mm:ss' }, // Hiển thị phần chọn giờ
        format: 'DD/MM/YYYY', // Định dạng cho ngày và giờ
        allowClear: true, // Cho phép xóa giá trị
      },
      required: true,
    },
    // {
    //   field: 'quantity',
    //   label: 'Số lượng',
    //   component: 'InputNumber',
    //   required: true,
    //   colProps: { span: 24 },
    // },
    // {
    //   field: 'status',
    //   label: 'Trạng thái',
    //   component: 'Select',
    //   required: true,
    //   colProps: { span: 24 },
    //   componentProps: {
    //     options: [
    //       { label: 'Pending', value: 'pending' },
    //       { label: 'In Progress', value: 'in_progress' },
    //       { label: 'Completed', value: 'completed' },
    //     ],
    //     // allowClear: true,
    //     placeholder: 'Chọn trạng thái',
    //   },
    // },
  ];
  const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
    labelWidth: 120,
    layout: 'vertical',
    baseColProps: { span: 24 },
    rowProps: { gutter: 10 },
    schemas: getFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    // fetchProduct();
    // fetchProcess();
    fetchCustomer();
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    console.log(data);
    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({
        ...data.record,
        order_date: dayjs(data.record?.order_date),
        delivery_date: dayjs(data.record?.delivery_date),
      });
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Tạo mới' : 'Chỉnh sửa'));

  const handleSubmit = async () => {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values: any = await validate();
      if (!unref(isUpdate)) {
        const res: any = await createProductOrderApi(values);
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else msg.error('Thao tác thất bại');
      } else {
        const res: any = await updateProductOrderApi({ ...values, id: record.value?.id ?? null });
        if (res) {
          msg.success('Thao tác thành công');
          emit('success', {});
          closeModal();
        } else msg.error('Thao tác thất bại');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  };
  const fetchProduct = async (param: any = {}) => {
    try {
      const response: any = await searchProductApi(param);
      productOptions.value = response?.data?.map((item) => ({
        label: item.product_name,
        value: item.id,
      }));
      updateSchema({
        field: 'product_id',
        componentProps: {
          options: productOptions.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };

  const fetchProcess = async (param: any = {}) => {
    try {
      const response: any = await searchProcessApi(param);
      processOptions.value = response?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'process_id',
        componentProps: {
          options: processOptions.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };

  const fetchCustomer = async (param: any = {}) => {
    try {
      const response: any = await searchCustomerApi(param);
      customerOptions.value = response?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      updateSchema({
        field: 'customer_id',
        componentProps: {
          options: customerOptions.value,
          allowClear: true,
        },
      });
    } catch (error) {
      msg.error(error.message);
    }
  };
</script>
