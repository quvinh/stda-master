<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Nhập số lượng NG"
    @ok="handleSubmit"
    :okText="'Xác nhận'"
    @cancel="handleCancel"
    :okButtonProps="{ disabled: !submitable }"
  >
    <!-- <template v-if="record?.lot_id">
      <div class="flex flex-col">
        <small class="font-semibold">Số LSX: {{ record?.batch_code }}</small>
        <small class="font-semibold">Mã sản phẩm: {{ record?.product_id }}</small>
        <small class="font-semibold">Số NG hiện tại: {{ record?.ng_quantity }}</small>
        <small class="font-semibold"
          >Số lượng thực tế hiện tại: {{ record?.actual_quantity }}</small
        >
      </div>
    </template> -->
    <Col :span="24" class="section-button col">
      <Input
        id="input"
        class="w-full"
        placeholder="NHẬP MÃ HOẶC QUÉT QR LỖI"
        @press-enter="addItem"
        v-model="inputValue"
      >
        <template #prefix>
          <div class="cursor-pointer" @click="handelOpenScannerModal">
            <Icon icon="ant-design:qrcode-outlined" size="25" style="margin-left: -8px" />
          </div>
        </template>
      </Input>
    </Col>
    <div v-for="(item, index) in items" :key="index" class="flex items-center">
      <Input class="w-full label" disabled :value="item.title" />
      <InputNumber
        v-model="item.quantity"
        placeholder="Nhập số lượng"
        :max="999999"
        :controls="false"
        :onchange="(e: any) => onChangeQuantity(e.target.value, item.id)"
      />
      <Icon
        icon="ant-design:close-outlined"
        size="30"
        color="red"
        @click="removeItem(item.id)"
        style="margin-left: 4px"
      />
    </div>
    <div class="flex flex-col">
      <medium class="font-semibold total"
        >Tổng Số Lượng NG Pallet: {{ (record?.ng_quantity || 0) + totalNgQuantity }}
      </medium>
      <medium class="font-semibold total"
        >Tổng Số Lượng NG LSX: {{ (record?.batch_ng_quantity || 0) + totalNgQuantity }}
      </medium>
    </div>

    <ScannerErrorModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerScannerErrorModal"
      @success="handleSuccessError"
    />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { message, Col, Input, InputNumber } from 'ant-design-vue';
  import { ref, computed } from 'vue';
  import axiosInstance from '@/api/resource/axiosInstance';
  import ApiResponse from '@/api/ApiResponse';
  import Icon from '@/components/Icon/Icon.vue';
  import ErrorQualityResource from '@/api/resource/ErrorQualityResource';
  import ScannerErrorModal from './ScannerErrorModal.vue';

  const emit = defineEmits(['success']);

  interface Item {
    quantity: number;
    title: string;
    id: string;
  }

  const record = ref<any>();
  const items = ref<Item[]>([]);
  const inputValue = ref<string>('');
  const submitable = computed(() => items.value.length > 0);

  const totalNgQuantity = computed(() => {
    return items.value.reduce((sum: number, item: Item) => sum + (item.quantity || 0), 0);
  });

  const [registerScannerErrorModal, { openModal: openScannerErrorModal }] = useModal();

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    record.value = data ?? null;
    setModalProps({ loading: false, confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      setModalProps({ loading: true, confirmLoading: true });

      if (record.value?.lot_id) {
        const ngQuantity = (record.value?.ng_quantity || 0) + totalNgQuantity.value;
        const response: ApiResponse = await axiosInstance.post('v1/qc/submit-self-qc', {
          lot_id: record.value.lot_id,
          ng_quantity: ngQuantity,
          process_errors: items.value.map((item: any) => ({
            id: item.id,
            ng_quantity: item.quantity,
          })),
        });
        if (response.success) {
          emit('success', {});
          handleCancel();
        }
      } else message.error('Batch ID not found');
    } catch (error) {
      console.log(error.message);
    } finally {
      setModalProps({ loading: false, confirmLoading: false });
    }
  }

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  const handleCancel = () => {
    items.value = [];
    closeModal();
  };

  async function addItem(e: any) {
    try {
      const value = e.target.value;
      if (value) {
        const res: any = await ErrorQualityResource.getById(value);
        const isExist = items.value.some((item: any) => item.id === value);
        if (!isExist && res.data?.id) {
          items.value.push({ quantity: 0, title: res.data.error_quality_name, id: res.data.id });
        }
      }
      const inputElement = document.getElementById('input') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function onChangeQuantity(value: string, id: string) {
    if (value) {
      items.value?.map((item: any) => {
        if (item.id === id) {
          item.quantity = parseInt(value, 10);
        }
        return {
          ...item,
        };
      });
    }
  }

  function handelOpenScannerModal() {
    openScannerErrorModal(true, {});
  }

  async function handleSuccessError(values) {
    console.log(values);
    if (values?.id) {
      const data: any = { target: { value: String(values.id).trim() } };
      addItem(data);
    }
  }
</script>

<style scoped>
  /* .col {
margin-top: 8px;
} */
  .items-center {
    margin-top: 8px;
  }

  .label {
    margin-right: 4px;
    color: black;
    text-align: center;
  }

  .total {
    margin-top: 8px;
  }
</style>
