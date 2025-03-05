<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Nhập số lượng NG"
    @cancel="closeModal"
    style="top: 10px"
  >
    <Form ref="formRef" :model="formData" layout="vertical">
      <div class="h-[250px] overflow-y-auto">
        <Input
          id="input"
          class="w-[99%] mb-1"
          placeholder="NHẬP MÃ HOẶC QUÉT QR LỖI"
          @press-enter="addItem"
          v-model="inputValue"
        >
          <template #prefix>
            <div class="cursor-pointer" @click="handelOpenScannerModal">
              <Icon icon="ant-design:qrcode-outlined" size="25" class="ml-[-8px]" />
            </div>
          </template>
        </Input>

        <div v-for="(item, index) in items" :key="index" class="flex items-center mb-1">
          <Input class="w-full label" disabled :value="item.title" />
          <InputNumber
            v-model="item.quantity"
            placeholder="Nhập số lượng"
            :min="0"
            :controls="false"
            :value="item.quantity"
            :onchange="(e: any) => onChangeQuantity(e.target.value, item.id)"
          />
          <Icon
            icon="ant-design:close-outlined"
            size="30"
            color="red"
            @click="removeItem(item.id)"
            class="ml-1"
          />
        </div>
        <!-- <template v-for="(item, index) in errorQualities" :key="index">
          <FormItem
            :name="`${item.id}`"
            style="margin-bottom: 5px"
            :rules="[{ required: true, message: 'Vui lòng nhập' }]"
          >
            <Row :gutter="5" class="w-[99%]">
              <Col span="12" class="bg-gray-200 flex items-center justify-start">
                <span class="pl-2">{{ item?.error_quality_name }}</span>
              </Col>
              <Col span="12">
                <InputNumber v-model:value="formData[item.id]" :min="0" placeholder="Nhập SL NG" />
              </Col>
            </Row>
          </FormItem>
        </template> -->
      </div>
    </Form>
    <Divider />
    <Form ref="formNGRef" :model="formDataNG" layout="vertical">
      <FormItem
        name="reuse_ng_quantity"
        style="margin-bottom: 5px"
        :rules="[{ required: true, message: 'Vui lòng nhập' }]"
      >
        <Row :gutter="5" class="w-[98%]">
          <Col span="12" class="bg-gray-200 flex items-center justify-start">
            <span class="pl-2">SL.NG tái sử dụng</span>
          </Col>
          <Col span="12">
            <InputNumber
              v-model:value="formDataNG.reuse_ng_quantity"
              :min="0"
              :max="maxReuse"
              placeholder="Nhập SL NG"
              @change="loadFormData"
            />
          </Col>
        </Row>
      </FormItem>
      <FormItem
        name="unrepairable_ng_quantity"
        style="margin-bottom: 5px"
        :rules="[
          { required: true, message: 'Vui lòng nhập' },
          { validator: (_, value) => validateQuantity(value) },
        ]"
      >
        <Row :gutter="5" class="w-[98%]">
          <Col span="12" class="bg-gray-200 flex items-center justify-start">
            <span class="pl-2">SL.NG phế phẩm</span>
          </Col>
          <Col span="12">
            <InputNumber
              readonly
              v-model:value="formDataNG.unrepairable_ng_quantity"
              :min="0"
              placeholder="Nhập SL NG"
            />
          </Col>
        </Row>
      </FormItem>
    </Form>
    <template #footer>
      <Button @click="handleSave" block type="primary">Lưu</Button>
    </template>

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
  import {
    Button,
    Form,
    FormItem,
    InputNumber,
    Row,
    Col,
    Divider,
    Input,
    message,
  } from 'ant-design-vue';
  import { ref, computed } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import ErrorQualityResource from '@/api/resource/ErrorQualityResource';
  import IErrorQuality from '@/api/model/IErrorQuality';
  import { QualityNgCheckEntity } from '@/api/model/QualityNgCheckEntity';
  import QualityNgCheckResource from '@/api/resource/QualityNgCheckResource';
  import Icon from '@/components/Icon/Icon.vue';
  import ScannerErrorModal from '@/views/oi-views/production/components/ScannerErrorModal.vue';

  // interface CriteriaNgQuantity {
  //   id: IErrorQuality['id'];
  //   quantity: number;
  // }

  interface Item {
    quantity: number;
    title: string;
    id: string;
  }

  const emit = defineEmits(['success']);
  const formRef = ref<FormInstance>();
  const formNGRef = ref<FormInstance>();
  const formData = ref<any>({});
  const formDataNG = ref<any>({ reuse_ng_quantity: null, unrepairable_ng_quantity: null });
  const errorQualities = ref<any[]>([]);
  const items = ref<Item[]>([]);
  const inputValue = ref<string>('');

  const [registerScannerErrorModal, { openModal: openScannerErrorModal }] = useModal();
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, confirmLoading: true });
    items.value = [];
    formRef.value?.resetFields();
    formNGRef.value?.resetFields();
    await fetchData(data);
    setModalProps({ loading: false, confirmLoading: false });
  });

  const maxReuse = computed(() => items.value.reduce((a, b) => a + Number(b.quantity), 0));

  async function handleSave() {
    // const valuesError: any = await formRef.value?.validate();
    const valuesNG: any = await formNGRef.value?.validate();
    const reuse_ng_quantity = valuesNG?.reuse_ng_quantity;
    const unrepairable_ng_quantity = valuesNG?.unrepairable_ng_quantity;
    // const error_qualities: CriteriaNgQuantity[] = [];
    // Object.keys(valuesError).forEach((key) => {
    //   error_qualities.push({ id: key, quantity: valuesError[key] });
    // });
    const combinedData = {
      error_qualities: items.value.map(({ id, quantity }) => ({ id, quantity })),
      reuse_ng_quantity,
      unrepairable_ng_quantity,
    };
    emit('success', combinedData);
    closeModal();
  }

  async function fetchData(params: any = {}) {
    const res: any = await ErrorQualityResource.getAll<IErrorQuality>({
      process_id: params?.process_id,
    });
    const serverDataResponse = await QualityNgCheckResource.getAll<QualityNgCheckEntity>({
      lot_history_id: params?.lot_history_id,
    });
    const serverData = serverDataResponse?.data?.data || [];
    if (res?.success) {
      errorQualities.value = res.data.data || [];
      (res.data.data || []).forEach((row) => {
        formData.value[row.id] = null;
      });
    }
    serverData.forEach((row) => {
      formData.value[row.error_quality_id] = row.quantity_ng; // Sử dụng formData.value
      if (row.error_quality_id) {
        items.value.push({
          id: row.error_quality_id,
          title: row.error_quality_id,
          quantity: Number(row.quantity_ng),
        });
      }
    });

    formDataNG.value['reuse_ng_quantity'] = params?.reuse_ng_quantity || 0;
    formDataNG.value['unrepairable_ng_quantity'] = params?.unrepairable_ng_quantity || 0;
  }

  /**
   * Sửa tạm addItem
   * @param e
   */
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

  function loadFormData() {
    try {
      formDataNG.value['unrepairable_ng_quantity'] =
        items.value.reduce((a, b) => a + Number(b.quantity), 0) -
        formDataNG.value['reuse_ng_quantity'];
    } catch (error) {
      message.error(error.message);
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
    loadFormData();
  }

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id);
    loadFormData();
  }

  function validateQuantity(value) {
    if (Number(value) >= 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Số lượng phải lớn hơn 0!'));
  }
</script>
