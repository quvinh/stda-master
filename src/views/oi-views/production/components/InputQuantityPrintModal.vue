<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="In tem đóng gói"
    @cancel="handleCancle"
    @ok="handleSubmit"
    style="top: 10px"
  >
    <Table
      class="mb-1"
      size="small"
      :columns="columnsSummary"
      :dataSource="[dataSummary]"
      :bordered="true"
      :pagination="false"
      :scroll="{ x: 300, y: 40 }"
    />

    <Form ref="formRef" :model="formData">
      <FormItem
        label="SL In"
        name="quantity"
        :rules="[{ validator: (_, value) => validateQuantity(value), trigger: 'change' }]"
        :labelCol="{ span: 24 }"
        :wrapperCol="{ span: 24 }"
      >
        <InputNumber
          v-model:value="formData.quantity"
          :min="0"
          :max="dataSummary.remaining_quantity"
          placeholder="Nhập số lượng"
          @change="handleQuantityChange"
        />
      </FormItem>
    </Form>

    <Descriptions
      v-if="formData.quantity > 0"
      bordered
      size="small"
      layout="horizontal"
      :column="1"
      :labelStyle="{ width: '120px' }"
    >
      <DescriptionsItem label="Lot size">{{ formatNumber(dataSummary.lot_size) }}</DescriptionsItem>
      <DescriptionsItem label="Số Lot chẵn">{{ formatNumber(dataNumber.even) }}</DescriptionsItem>
      <DescriptionsItem label="Số Lot lẻ">{{ formatNumber(dataNumber.odd) }}</DescriptionsItem>
    </Descriptions>

    <div class="hidden">
      <div ref="labelRef">
        <div v-html="htmlContent?.html"></div>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { printPackingPalletTemplate } from '@/api/sys/print';
  import { getPackingPrintDataApi, mergeLotsApi } from '@/api/sys/production-plan';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { formatNumber } from '@/utils/helper/tsxHelper';
  import {
    Descriptions,
    DescriptionsItem,
    Form,
    FormItem,
    InputNumber,
    message,
    Table,
  } from 'ant-design-vue';
  import { ColumnType } from 'ant-design-vue/es/table';
  import printJS from 'print-js';
  import { reactive, ref } from 'vue';

  interface IHtmlContent {
    html: string;
    width: number;
    height: number;
  }

  const emit = defineEmits(['success']);

  const formRef = ref<any>();
  const labelRef = ref<HTMLDivElement | null>(null);
  const htmlContent = ref<IHtmlContent | null>(null);
  const qrCodePluginRef = ref<any>(null);
  const dataSummary = ref<{
    total_quantity: number;
    remaining_quantity: number;
    printed_quantity: number;
    lot_size: number;
  }>({
    total_quantity: 0,
    remaining_quantity: 0,
    printed_quantity: 0,
    lot_size: 1,
  });
  const dataNumber = ref<{ even: number; odd: number }>({ even: 0, odd: 0 });
  const lotId = ref<string>();
  const formData = reactive<any>({
    quantity: 0,
  });

  const timer = ref<any>();

  const columnsSummary = ref<ColumnType[]>([
    {
      title: 'Tổng đóng gói',
      dataIndex: 'total_quantity',
      width: 100,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Tổng đã in',
      dataIndex: 'printed_quantity',
      width: 100,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Tổng chưa in',
      dataIndex: 'remaining_quantity',
      width: 100,
      customRender: ({ value }) => formatNumber(value),
    },
  ]);

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    if (data?.lot_id) {
      lotId.value = data.lot_id;
      loadData(data);
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  function handleCancle() {
    qrCodePluginRef.value?.stopScan();
    closeModal();
  }

  async function loadData(param: any = {}) {
    const res: any = await getPackingPrintDataApi(param);
    if (res) {
      const { total_quantity, printed_quantity, remaining_quantity, lot_size } = res;
      dataSummary.value = { total_quantity, printed_quantity, remaining_quantity, lot_size };
    }
  }

  /**
   * @description Handle submit
   */
  async function handleSubmit() {
    if (lotId.value) {
      const values: any = await formRef.value?.validate();
      const response: any = await printPackingPalletTemplate({
        required_quantity: values.quantity,
        lot_id: lotId.value,
      });
      if (response) {
        const { html, width, height } = response;
        htmlContent.value = {
          html: html,
          width: width ?? 100,
          height: height ?? 60,
        };
        setTimeout(async () => {
          if (!labelRef.value || !htmlContent.value?.html) {
            message.info('Không thể in tem');
            return;
          }
          const style: string = `
            @page {
              size: ${htmlContent.value?.width}mm ${htmlContent.value?.height}mm;
              margin: 0;
            }
            @media print {
              .label-print {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100% !important;
                height: 100% !important;
              }
            }
          `;
          printJS({
            printable: labelRef.value.outerHTML,
            type: 'raw-html',
            targetStyles: ['*'],
            style,
          });
        }, 500);
      }

      emit('success', {});
      handleCancle();
    } else {
      message.error('Không tìm thấy mã Pallet!');
    }
  }

  /**
   * @description Validate quantity
   * @param value
   */
  function validateQuantity(value) {
    if (!value) return Promise.reject(new Error('Vui lòng nhập!'));
    if (Number(value) > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('SL lớn hơn 0!'));
  }

  function handleQuantityChange(value) {
    const remain = dataSummary.value.remaining_quantity;
    const lot_size = dataSummary.value.lot_size;
    if (remain > 0 && value > 0 && lot_size > 0) {
      clearTimeout(timer.value);
      timer.value = setTimeout(() => {
        let even = 0;
        let odd = 0;
        if (value < lot_size) {
          even = 0;
          odd = 1;
        } else {
          even = parseInt(value / lot_size);
          odd = (value % lot_size) / lot_size;
          if (odd > 0 && odd < 1) odd = 1;
          odd = parseInt(odd);
        }

        dataNumber.value = { even, odd };
      }, 500);
    }
  }
</script>
