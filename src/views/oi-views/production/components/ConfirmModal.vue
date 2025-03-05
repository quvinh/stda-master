<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    okText="Hoàn thành"
    cancelText="Tạm dừng"
  >
    <Form :model="formData" ref="formRef">
      <Row :gutter="24">
        <Col :span="12">
          <FormItem
            :rules="rules.input"
            name="proccess"
            label="Công đoạn"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 24 }"
            required
          >
            <Select class="w-full" placeholder="Công đoạn" />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem
            name="equipment"
            label="Máy"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 24 }"
            required
          >
            <Select :options="[]" placeholder="Chọn máy" style="width: 100%" />
          </FormItem>
        </Col>
        <Col :span="24">
          <Table
            size="small"
            :loading="loading"
            :columns="columns"
            :dataSource="[]"
            :bordered="true"
            :pagination="false"
            :locale="{ emptyText: '&nbsp' }"
          />
        </Col>
      </Row>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Col, Form, FormItem, Row, Select, Table } from 'ant-design-vue';
  // import { useMessage } from '@/hooks/web/useMessage';

  const emit = defineEmits(['success']);
  const formRef = ref();
  const isUpdate = ref<boolean>(false);
  const loading = ref<boolean>(false);

  // const { createMessage: msg } = useMessage();

  const formData = reactive<any>({
    pallet_amount: null,
    material_receipt_id: '',
    material_receipt_item_id: '',
    material_id: '',
    lot_no: '',
    quantity: null,
  });

  const columns = [
    { title: 'PO', dataIndex: 'po', align: 'center' },
    { title: 'LOT', dataIndex: 'lot', align: 'center' },
    { title: 'Mã sản phẩm', dataIndex: 'product_id', align: 'center' },
    { title: 'Số lượng SX theo kế hoạch', dataIndex: 'plan_quantity', align: 'center' },
    { title: 'Trạng thái', dataIndex: 'status', align: 'center' },
    { title: 'Thời gian duyệt', dataIndex: 'checked_time', align: 'center' },
    { title: 'ID Quản lý duyệt', dataIndex: 'checked_user_id', align: 'center' },
  ];

  const rules = {
    input: [
      { required: true, message: 'Vui lòng nhập số bản ghi' },
      {
        pattern: /^\d*$/,
        message: 'Chỉ được nhập số',
      },
    ],
  };

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    // resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;

    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = 'Xác nhận kiểm tra đầu vào';

  function handleSubmit() {
    emit('success', true);
    closeModal();
    // var form = unref(formRef);
    // try {
    //   loading.value = true;
    //   warehouseStore
    //     .createPallet({
    //       ...form.getFieldsValue(),
    //       material_receipt_item_id: m,
    //     })
    //     .then((res) => {
    //       if (res) {
    //         msg.success('Thao tác thành công');
    //         emit('success', {});
    //         formRef.value.resetFields();
    //         closeModal();
    //       } else msg.error('Thao tác thất bại');
    //     })
    //     .catch((error) => {
    //       msg.error(error.message);
    //     });
    // } catch (error) {
    //   console.log(error.message);
    // } finally {
    //   setModalProps({ loading: false, confirmLoading: false });
    // }
  }

  // async function fetchData(param: String) {
  //   try {
  //     loading.value = true;
  //     const response = await warehouseStore.searchPalletByID(param);
  //     // Set data
  //     const warehouseData = response.data ?? [];
  //     warehouse.value = warehouseData.map((warehouse) => ({
  //       ...warehouse,
  //       receipt_id: warehouse.id,
  //       date_of_receipt: warehouse.receipt_date,
  //       entered_by: warehouse.user.name,
  //     }));
  //   } catch (error) {
  //     console.log('vao error');
  //     message.error(error);
  //   } finally {
  //     console.log('vao finally');
  //     loading.value = false;
  //   }
  // }
</script>
