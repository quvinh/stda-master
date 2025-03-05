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
        <Row class="flex flex-col flex-1" />
      </div>

      <div class="flex-1 flex flex-col overflow-y-auto section-search-input pr-1">
        <Divider style="margin: 4px 0; font-size: 14px">Điều kiện truy vấn</Divider>
        <FormItem label="Mã khuôn" name="id">
          <Input v-model:value="formData.id" placeholder="Vui lòng nhập" />
        </FormItem>

        <FormItem label="Tên khuôn" name="mold_name">
          <Input v-model:value="formData.mold_name" placeholder="Vui lòng nhập" />
        </FormItem>

        <FormItem label="Tên khuôn" name="mold_name">
          <Input v-model:value="formData.mold_name" placeholder="Vui lòng nhập" />
        </FormItem>

        <FormItem label="Vị trí" name="location">
          <Select
            v-model:value="formData.location"
            placeholder="Vui lòng nhập"
            :options="warehouseLocationOptions"
            :allowClear="true"
            :showSearch="true"
          />
        </FormItem>
      </div>
    </div>

    <div
      class="sticky bottom-0 left-0 right-0 bg-white pt-1 border-t border-gray-300 section-button"
    >
      <FormItem class="text-center mb-1 p-0">
        <Button block type="primary" size="large" htmlType="submit" class="m-0">
          <Icon icon="ant-design:search-outlined" />
          Tìm kiếm
        </Button>
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { useProcessStore } from '@/store/modules/states/process';
  import { Button, Form, FormItem, Input, Row, Divider, Select } from 'ant-design-vue';
  import { DataNode } from 'ant-design-vue/lib/tree';
  import dayjs, { Dayjs } from 'dayjs';
  import { unref, ref, PropType, reactive, onMounted } from 'vue';
  import WarehouseLocationResource from '@/api/resource/WarehouseLocationResource';

  const emit = defineEmits(['success']);
  const props = defineProps({
    filter: {
      type: Object as PropType<{
        process?: string[];
        dates?: Dayjs[];
        id?: string;
        mold_name?: string;
        location: string;
      }>,
      default: () => ({
        process: [],
        dates: [dayjs(), dayjs()],
        id: '',
        mold_name: '',
        location: '',
      }),
    },
  });

  const formRef = ref();
  const formData = reactive<any>({
    process: props.filter.process || [],
    dates: props.filter.dates,
    id: '',
    mold_name: '',
  });
  const treeData = ref<DataNode[]>([]);
  const processStore = useProcessStore();
  const warehouseLocationOptions = ref<{ label: string; value: string }[]>([]);

  onMounted(async () => {
    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 300);
    const response = await processStore.search();
    if (response?.data) {
      treeData.value = response.data.map((item: any) => ({
        title: item.name,
        key: item.id,
        children: item.equipments?.map((equipment: any) => ({
          title: equipment.id,
          key: equipment.id,
        })),
      }));
    }

    WarehouseLocationResource.getOptions().then((res) => {
      warehouseLocationOptions.value = res.map((item: any) => ({
        label: item.label,
        value: item.value,
      }));
    });
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

  function handleSubmit() {
    const form = unref(formRef);
    emit('success', form.getFieldsValue());
  }
</script>
