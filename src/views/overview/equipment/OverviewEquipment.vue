<template>
  <div
    class="bg-white flex flex-col gap-1 overflow-auto"
    style="width: 100%; height: calc(100vh - 65px) !important"
  >
    <div class="text-right">
      <Select
        class="w-full"
        placeholder="Tìm thiết bị"
        mode="multiple"
        v-model:value="equipmentSelected"
        :options="equipmentOptions"
        :show-search="true"
        option-filter-prop="label"
      />
    </div>
    <Row :gutter="[4, 4]" class="w-full flex flex-wrap items-stretch">
      <Col span="6" v-for="(item, index) in fakeData" :key="index" class="flex flex-col">
        <EquipmentCard :title="item.title" :value="item.value" :chart="item.chart" />
      </Col>
    </Row>
  </div>
</template>

<script setup lang="ts">
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
  import EquipmentCard from './components/EquipmentCard.vue';
  import { Col, Row, Select } from 'ant-design-vue';
  import { ISelectOption } from '@/store/types/pagination';
  import { searchEquipmentApi } from '@/api/sys/equipment';
  import { IEquipment } from '@/api/model/IEquipment';

  const oiHeaderStore = useOIHeaderStore();

  const fakeData = ref<any[]>([]);
  const equipmentOptions = ref<ISelectOption[]>([]);
  const equipmentData = ref<IEquipment[]>([]);
  const equipmentSelected = ref<string[]>([]);

  onMounted(() => {
    oiHeaderStore.setTitle('THIẾT BỊ');
    fetchData();

    const intervalId = setInterval(() => {
      mockData(equipmentSelected.value);
    }, 10000);

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });
  });

  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function fetchData() {
    const response: any = await searchEquipmentApi();
    if (response?.data) {
      equipmentData.value = response.data || [];
      equipmentOptions.value = response.data?.map(({ id, equipment_name }) => ({
        label: equipment_name,
        value: id,
      }));
      mockData(equipmentSelected.value);
    }
  }

  function mockData(filter: string[] = []) {
    let records = equipmentData.value;
    if (filter.length > 0) {
      records = equipmentData.value.filter(({ id }) => filter.includes(id));
    }
    fakeData.value = records.map((item) => {
      const number1 = getRandomNumber(0, 500);
      const number2 = getRandomNumber(100, 500);
      const percent = getRandomNumber(0, 100);

      return {
        title: item.equipment_name,
        value: {
          number1,
          number2,
          percent,
        },
        chart: [
          { name: 'Usage', value: percent },
          { name: 'Remain', value: 100 - percent },
        ],
      };
    });
  }

  watch(
    () => equipmentSelected.value,
    (newValue) => {
      if (newValue.length > 0) {
        mockData(newValue);
      }
    },
  );
</script>
