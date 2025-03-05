<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <div v-if="isUpdate">
      <Form :model="formData" ref="formRef" @keypress.enter="handleSubmit" @ok="handleSubmit">
        <Row :gutter="24">
          <Col :span="8">
            <FormItem
              :rules="rules.input"
              name="pallet_amount"
              label="Số bản ghi"
              :labelCol="{ span: 24 }"
              :wrapperCol="{ span: 24 }"
              required
            >
              <InputNumber
                :min="1"
                @change="handleChangeNumberRecord"
                v-model:value="formData.pallet_amount"
                placeholder="Nhập số bản ghi"
              />
            </FormItem>
          </Col>
          <Col :span="16">
            <FormItem
              name="material_receipt_id"
              label="Mã phiếu"
              :labelCol="{ span: 24 }"
              :wrapperCol="{ span: 24 }"
              required
            >
              <Select
                v-model:value="formData.material_receipt_id"
                :options="dataMaterialReceipt"
                placeholder="Chọn mã phiếu"
                style="width: 100%"
                @change="handleChange"
              />
            </FormItem>
          </Col>
        </Row>
        <FormItem
          name="material_id"
          label="Mã NVL"
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          required
        >
          <Select
            v-model:value="formData.material_id"
            :options="dataMaterialReceiptItem"
            placeholder="Chọn mã NVL"
            @change="handleChangeMaterial"
          />
        </FormItem>

        <FormItem
          name="lot_no"
          label="Lot No"
          :labelCol="{ span: 24 }"
          :wrapperCol="{ span: 24 }"
          required
        >
          <Input v-model:value="formData.lot_no" />
        </FormItem>
        <Row v-for="(item, index) in formData.items" :key="index" :gutter="[10, 10]">
          <Col :span="2" class="pb-2">
            <div v-if="index === 0" class="pb-2">STT</div>
            <Input class="text-center" :value="index + 1" readonly
          /></Col>
          <Col :span="6" class="pb-2">
            <div v-if="index === 0" class="pb-2">SL 1</div>
            <FormItem :name="['items', index, 'quantity_1']">
              <InputNumber v-model:value="item.quantity_1" placeholder="Số lượng 1" />
            </FormItem>
          </Col>
          <Col :span="5">
            <div v-if="index === 0" class="pb-2">ĐVT 1</div>
            <FormItem :name="['items', index, 'unit_id_1']">
              <Select v-model:value="item.unit_id_1" :options="units" placeholder="Đơn vị tính 1" />
            </FormItem>
          </Col>
          <Col :span="6">
            <div v-if="index === 0" class="pb-2">SL 2</div>
            <FormItem :name="['items', index, 'quantity_2']">
              <InputNumber v-model:value="item.quantity_2" placeholder="Số lượng 1" />
            </FormItem>
          </Col>
          <Col :span="5">
            <div v-if="index === 0" class="pb-2">ĐVT 2</div>
            <FormItem :name="['items', index, 'unit_id_2']">
              <Select v-model:value="item.unit_id_2" :options="units" placeholder="Đơn vị tính 2" />
            </FormItem>
          </Col>
        </Row>
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
      <Table :column="columnPallet" size="middle" bordered />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, reactive, onMounted, watch } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import {
    Col,
    Form,
    FormItem,
    Input,
    InputNumber,
    Row,
    Select,
    Table,
    message,
  } from 'ant-design-vue';
  import Html5QrcodePlugin from '@/components/Html5Qrcode/Html5QrcodePlugin.vue';
  import { IWarehouse } from '@/api/model/IWarehouse';
  import { useWarehouseStore } from '@/store/modules/states/warehouse';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination, ISelectOption } from '@/store/types/pagination';
  import { useMessage } from '@/hooks/web/useMessage';
  import { searchUnitApi } from '@/api/sys/unit';

  type Pair = {
    label: string;
    value: string;
  };

  const emit = defineEmits(['success']);
  const formRef = ref();
  const countRecord = ref<number>(1);
  const isUpdate = ref<boolean>(true);
  const qrCodePluginRef = ref<any>(null);
  const isScanningRef = ref<boolean>(true);
  const loading = ref<boolean>(false);
  const warehouseStore = useWarehouseStore();
  const { createMessage: msg } = useMessage();
  const warehouse = ref<IWarehouse[]>([]);
  const dataMaterialReceipt = ref<Pair[]>([]);
  const dataMaterialReceiptItem = ref<Pair[]>([]);
  const units = ref<ISelectOption[]>([]);

  const formData = reactive<any>({
    pallet_amount: 1,
    material_receipt_id: '',
    material_receipt_item_id: '',
    material_id: '',
    lot_no: '',
    items: Array.from({ length: countRecord.value }, () => ({
      quantity_1: '',
      quantity_2: '',
      unit_id_1: '',
      unit_id_2: '',
    })),
  });

  watch(
    () => countRecord.value,
    (newCount) => {
      var currentLength = formData.items.length;
      if (newCount > 0) {
        if (newCount > currentLength) {
          for (let i = currentLength; i < newCount; i++) {
            formData.items.push({
              quantity_1: '',
              quantity_2: '',
              unit_id_1: '',
              unit_id_2: '',
            });
          }
        } else {
          while (currentLength-- > newCount) {
            formData.items.pop();
          }
        }
      }
    },
  );

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
   * @description: form schema
   */

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
    // resetFields();
    setModalProps({ loading: true, confirmLoading: true });
    isUpdate.value = !!data?.isUpdate;
    dataMaterialReceipt.value = data.materialReceipt?.map((i) => ({
      value: i.id,
      label: i.id,
    }));
    setModalProps({ loading: false, confirmLoading: false });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? 'Quét QR mã Pallet' : 'Tạo pallet'));

  onMounted(() => {
    fetchUnits();
    formData.material_receipt_id = dataMaterialReceipt.value[0];
    formData.material_receipt_item_id = dataMaterialReceiptItem.value[0];
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const formattedDate = `${day}${month}`;
    formData.lot_no = formattedDate;
  });

  async function fetchUnits(param: any = {}) {
    loading.value = true;
    const response: any = await searchUnitApi(param);
    if (response?.data) {
      units.value = (response.data || []).map((item) => ({
        value: item.id,
        label: item.unit_name,
      }));
      units.value?.forEach((i) => {
        if (i.label === 'kg') formData.items[0].unit_id_2 = i.value;
      });
    }
    loading.value = false;
  }

  function handleSubmit() {
    var form = unref(formRef);
    try {
      const m = myMap.get(form.getFieldsValue().material_id);
      loading.value = true;
      warehouseStore
        .createPallet({
          ...form.getFieldsValue(),
          material_receipt_item_id: m,
        })
        .then((res) => {
          if (res) {
            msg.success('Thao tác thành công');
            emit('success', {});
            formRef.value.resetFields();
            closeModal();
          } else msg.error('Thao tác thất bại');
        })
        .catch((error) => {
          msg.error(error.message);
        });
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  async function handleScanResult(value) {
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
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
  var myMap = new Map<string, string>();

  const paginationProp = ref<PaginationProps | any>({
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    current: page,
    total: totalPage,
    pageSizeOptions,
    showTotal: (totalPage) => `Total ${totalPage} items`,
  });

  async function fetchData(param: String) {
    try {
      loading.value = true;
      const response = await warehouseStore.searchPalletByID(param);
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
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function handleChange(params: any) {
    try {
      loading.value = true;
      const response = await warehouseStore.searchMaterialReceiptItem(params);
      dataMaterialReceiptItem.value = response.data?.map((i) => ({
        value: i.material.id,
        label: i.material.id,
        id: i?.id,
      }));
      response.data.forEach((value) => {
        myMap.set(value.material.id, value.id);
      });
      formData.material_id = dataMaterialReceiptItem.value[0].label;
      formData.items[0].unit_id_1 = response.data[0].material.unit?.id;
    } catch (error) {
      console.log('vao error');
      message.error(error);
    } finally {
      console.log('vao finally');
      loading.value = false;
    }
  }

  function handleChangeMaterial(value) {
    formData.material_receipt_item_id = myMap.get(value);
  }

  function handleChangeNumberRecord(e) {
    countRecord.value = e;
  }
</script>
