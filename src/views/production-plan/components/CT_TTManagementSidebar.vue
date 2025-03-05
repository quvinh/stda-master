<template>
  <Form
    ref="formRef"
    :model="formData"
    @keypress.enter="handleSubmit"
    @submit="handleSubmit"
    class="bg-white pl-2 pr-2 flex flex-col h-full section-form border-1 border-gray-300"
    layout="vertical"
  >
    <div class="flex-1 flex flex-col h-[calc(100%-60px)]">
      <div class="mb-0">
        <Row
          class="flex flex-col flex-1"
          style="align-items: center; justify-content: center; padding-top: 10px"
        >
          <h3>Truy vấn</h3>
        </Row>
      </div>

      <div>
        <FormItem label="Thiết bị" name="dates">
          <Select placeholder="Chọn thiết bị" />
        </FormItem>
        <FormItem label="Thời gian bắt đầu" name="dates">
          <DatePicker style="width: 100%"
        /></FormItem>
        <FormItem label="Thời gian kết thúc" name="dates">
          <DatePicker style="width: 100%"
        /></FormItem>
        <FormItem label="Mã nội bộ" name="local_id">
          <Input placeholder="Nhập mã nội bộ"
        /></FormItem>
        <FormItem label="Lô sản xuất" name="lo_id">
          <Input placeholder="Nhập lô sản xuất"
        /></FormItem>
        <FormItem label="Mã lot" name="lo_id"> <Input placeholder="Nhập mã lot" /></FormItem>
        <!-- Add here -->
      </div>
    </div>

    <div
      class="sticky bottom-0 left-0 right-0 bg-white pt-1 border-t border-gray-300 section-button"
    >
      <FormItem class="text-center mb-1 p-0">
        <Button block type="primary" size="large" htmlType="submit" class="m-0">
          <Icon icon="ant-design:search-outlined" /> Tìm kiếm
        </Button>
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { Button, DatePicker, Form, FormItem, Input, Row, Select } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { onUnmounted, unref, ref, PropType, reactive, onMounted } from 'vue';

  const emit = defineEmits(['success']);
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        process?: string[];
        dates?: Dayjs[];
        batch_id?: string;
        lot_id?: string;
      }>,
      default: () => ({
        process: [],
        dates: [dayjs(), dayjs()],
        batch_id: '',
        lot_id: '',
      }),
    },
  });

  const formRef = ref();
  const formData = reactive<any>({
    process: props.filter.process || [],
    dates: props.filter.dates,
    batch_id: props.filter.batch_id,
    lot_id: props.filter.lot_id,
  });
  const treeData = ref([
    {
      title: 'BBCB',
      key: '0-0',
      children: [
        {
          title: 'BINHBAI',
          key: '0-0-0',
          children: [{ title: 'Máy tính 1', key: '0-0-0-0' }],
        },
        {
          title: 'CHEBAN',
          key: '0-0-1',
          children: [
            { title: 'Máy tính 2', key: '0-0-1-0' },
            { title: 'Kodak', key: '0-0-1-1' },
            { title: 'Máy rửa kẽm PT90', key: '0-0-1-2' },
          ],
        },
      ],
    },
    {
      title: 'IN',
      key: '0-1',
      children: [
        {
          title: 'IN',
          key: '0-1-0',
          children: [
            {
              title: 'Máy in offset tờ rời 04 hiệu MIITSUBISHI D3000LS-4, khổ 72x102 cm',
              key: '0-1-0-0',
            },
            {
              title: 'Máy in offset tờ rời 4 hiệu MITSUBISHI D1000LS-4, khổ 52x72 cm',
              key: '0-1-0-1',
            },
            { title: 'Máy in offset tờ rời 5 màu  MISHUBISHI', key: '0-1-0-2' },
            { title: 'Máy nướng kẽm KYHW1300 HĐ 5596', key: '0-1-0-3' },
          ],
        },
      ],
    },
    {
      title: 'SX01',
      key: '0-2',
      children: [
        {
          title: 'BE',
          key: '0-2-0',
          children: [
            { title: 'Máy bế BTĐ ML-1100', key: '0-2-0-0' },
            { title: 'Máy bế BTĐ ML-1100', key: '0-2-0-1' },
            { title: 'Máy bế BTĐ ML-930J', key: '0-2-0-2' },
            { title: 'Máy bế tự động - YAWA-TD1060S', key: '0-2-0-3' },
            { title: 'Máy bế tự động - AEM-TD1050Q', key: '0-2-0-4' },
            { title: 'Máy bế chuồn chuồn HEIDELBERG', key: '0-2-0-5' },
            { title: 'Máy bế lăng', key: '0-2-0-6' },
          ],
        },
        {
          title: 'DAN',
          key: '0-2-1',
          children: [
            { title: 'Máy dán tự động - HOSON - ZH-1200BFST', key: '0-2-1-0' },
            { title: 'Máy dán tự động - HOSON - ZH-1000BFT-H', key: '0-2-1-1' },
          ],
        },
        {
          title: 'EPNHU',
          key: '0-2-2',
          children: [
            { title: 'Máy bế nhũ TYMX 930', key: '0-2-2-0' },
            { title: 'Máy bế nhũ taseco', key: '0-2-2-1' },
          ],
        },
      ],
    },
    {
      title: 'SX03',
      key: '0-3',
      children: [
        {
          title: 'TPTHUCONG',
          key: '0-3-0',
          children: [
            { title: 'Máy đóng nút BW_100', key: '0-3-0-0' },
            { title: 'Máy đóng nút BW_100', key: '0-3-0-1' },
            { title: 'Máy phối giấy bằng hơi duplo 8508A (máy chạy số)', key: '0-3-0-2' },
          ],
        },
      ],
    },
  ]);
  const expandedKeys = ref(['0-0']);
  const checkedKeys = ref([]);
  const selectedKeys = ref([]);

  onMounted(() => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });

  async function updateHeight() {
    const sectionForm: any = document.querySelector('.section-form');
    if (sectionForm) {
      const menuHeight = 50;
      const tabHeight = 30;
      const sectionButton: any = sectionForm.querySelector('.section-button');
      const result =
        window.innerHeight -
        menuHeight -
        tabHeight -
        Number(sectionButton.offsetHeight || 0) -
        200 -
        15;
      console.log('height =', result);
      if (result) {
        sectionForm
          .querySelector('.section-search-input')
          ?.style.setProperty('max-height', `${result}px`, 'important');
      }
    }
  }

  function onCheck(checkedKeys: any) {
    console.log('Checked keys:', checkedKeys);
    formData.process = checkedKeys;
  }

  function onSelect(selectedKeys: any) {
    console.log('Selected keys:', selectedKeys);
    formData.process = selectedKeys;
  }

  // function onExpand(expandedKeysValue: any) {
  //   expandedKeys.value =
  //     expandedKeysValue.length > 1 ? [expandedKeysValue.pop()] : expandedKeysValue;
  // }

  function handleSubmit() {
    const form = unref(formRef);
    emit('success', form.getFieldsValue());
  }
</script>
