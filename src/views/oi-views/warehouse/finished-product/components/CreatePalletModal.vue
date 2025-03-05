<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <div v-if="isUpdate">
      <Form>
        <Row :gutter="24">
          <Col :span="8">
            <FormItem
              label="Số bản ghi"
              :labelCol="{ span: 24 }"
              :wrapperCol="{ span: 24 }"
              required
            >
              <Input placeholder="Nhập số bản ghi" />
            </FormItem>
          </Col>
          <Col :span="16">
            <FormItem label="Mã phiếu" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }" required>
              <Select placeholder="Chọn mã phiếu" style="width: 100%">
                <SelectOption value="1">Phiếu 1</SelectOption>
                <SelectOption value="2">Phiếu 2</SelectOption>
                <SelectOption value="3">Phiếu 3</SelectOption>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="Mã NVL" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }" required>
          <Select placeholder="Chọn mã NVL">
            <SelectOption value="1">Phiếu 1</SelectOption>
            <SelectOption value="2">Phiếu 2</SelectOption>
            <SelectOption value="3">Phiếu 3</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="Lot No" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }" required>
          <Input value="23" />
        </FormItem>
        <FormItem label="Số lượng" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }" required>
          <Input placeholder="Số lượng" />
        </FormItem>
      </Form>
    </div>
    <div class="h-[400px]" v-if="!isUpdate">
      <Html5QrcodePlugin
        ref="qrCodePluginRef"
        :fps="10"
        :qrbox="250"
        :disableFlip="true"
        :qrCodeSuccessCallback="handleScanResult"
      />
      <br />
      <Table :columns="columnPallet" size="middle" bordered />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useForm } from '@/components/Form/index';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useCustomerStore } from '@/store/modules/states/customer';
  import {
    Col,
    Form,
    FormItem,
    Input,
    Row,
    Select,
    SelectOption,
    Table,
    message,
  } from 'ant-design-vue';
  import Html5QrcodePlugin from '@/components/Html5Qrcode/Html5QrcodePlugin.vue';
  import { IWarehouse } from '@/api/model/IWarehouse';
  import { useWarehouseStore } from '@/store/modules/states/warehouse';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';

  const emit = defineEmits(['success']);

  const { createMessage: msg } = useMessage();
  const customerStore = useCustomerStore();
  const record = ref<any>();
  const isUpdate = ref<boolean>(true);
  const qrCodePluginRef = ref<any>(null);
  const isScanningRef = ref<boolean>(true);
  const equipmentId = ref<any>();
  const loading = ref<boolean>(false);
  const warehouseStore = useWarehouseStore();
  const warehouse = ref<IWarehouse[]>([]);

  /**
   * @description: form schema
   */

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 120,
    layout: 'vertical',
    baseColProps: { span: 24 },
    rowProps: { gutter: 10 },
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const columnPallet = [
    { title: 'Mã Pallet', dataIndex: 'id', align: 'center' },
    { title: 'Số lượng', dataIndex: 'soluong', align: 'center' },
    { title: 'ĐVT', dataIndex: 'dvt', align: 'center' },
    { title: 'Vị trí', dataIndex: 'vitri', align: 'center' },
  ];

  /**
   * @description useModalInner 👈 dữ liệu nhận từ view cha
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      record.value = data.record;
      setFieldsValue({
        ...data.record,
      });
    }

    setModalProps({ loading: false, confirmLoading: false });
    qrCodePluginRef.value.resetScan();
    equipmentId.value = data?.equipment_id ?? null;
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Quét QR mã Pallet' : 'Tạo pallet'));

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });
      const values = await validate();
      if (!unref(isUpdate)) {
        // Force create
        await customerStore
          .create(values)
          .then((res) => {
            if (res) {
              msg.success('Thao tác thành công');
              emit('success', {}); // Emit success
              closeModal();
            } else msg.error('Thao tác thất bại');
          })
          .catch((error) => {
            msg.error(error.message);
          });
      } else {
        // Force update
        await customerStore
          .update({ ...values, id: record.value?.id ?? null })
          .then((res) => {
            if (res) {
              msg.success('Thao tác thành công');
              emit('success', {}); // Emit success
              closeModal();
            } else msg.error('Thao tác thất bại');
          })
          .catch((error) => {
            msg.error(error.message);
          });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  async function handleScanResult(value) {
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
      console.log(value);
      emit('success', { value });
      qrCodePluginRef.value.stopScan();
      fetchData(value);
      //handleCancle();
      setTimeout(() => {
        isScanningRef.value = true;
      }, 1000);
    }
  }
  const totalPage = ref<number>(0);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);

  const paginationProp = ref<PaginationProps | any>({
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    current: page,
    total: totalPage,
    pageSizeOptions,
    showTotal: (totalPage) => `Total ${totalPage} items`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });

  // const [registerTable, { setPagination }] = useTable({
  //   // title: 'Quản lý phiếu nhập kho NVL',
  //   dataSource: warehouse,
  //   columns: getBasicColumns(),
  //   useSearchForm: false,
  //   showTableSetting: false,
  //   showIndexColumn: true,
  //   rowKey: 'id',
  //   bordered: true,
  //   loading,
  // });

  async function fetchData(param: String) {
    try {
      loading.value = true;
      const response = await warehouseStore.searchPalletByID(param);
      console.log('value = ' + response);
      // Set data
      const warehouseData = response.data ?? [];
      warehouse.value = warehouseData.map((warehouse) => ({
        ...warehouse,
        receipt_id: warehouse.id,
        date_of_receipt: warehouse.receipt_date,
        entered_by: warehouse.user.name,
      }));
      // Set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = warehouse.value.length;
      if (pagination) totalRecord = pagination.total;
      paginationProp.value.current = page.value ?? 1;
      paginationProp.value.total = totalRecord ?? 0;
      paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
      // setPagination(paginationProp.value);
    } catch (error) {
      console.log('vao error');
      message.error(error);
    } finally {
      console.log('vao finally');
      loading.value = false;
    }
  }

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchData({ page: p, pageSize: pz });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchData({ page: page.value, pageSize: size });
  }
</script>
