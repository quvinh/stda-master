<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Chi tiết"
    :show-ok-btn="false"
    :show-cancel-btn="false"
  >
    <div class="h-[500px] flex flex-col gap-1">
      <Descriptions size="small" layout="vertical" bordered>
        <DescriptionsItem label="Vị trí">{{ record?.id }}</DescriptionsItem>
        <DescriptionsItem label="Sức chứa">{{ record?.capacity }}</DescriptionsItem>
        <DescriptionsItem label="Còn trống">{{ record?.remain }}</DescriptionsItem>
      </Descriptions>
      <Table
        size="small"
        :data-source="dataTable"
        :columns="columns"
        :scroll="{ x: 300 }"
        :pagination="false"
        bordered
      />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Descriptions, DescriptionsItem, Table } from 'ant-design-vue';
  import { ref } from 'vue';

  const columns: any[] = [
    {
      title: 'Tên NVL',
      dataIndex: 'material_name',
      align: 'left',
    },
    {
      title: 'SL tồn',
      dataIndex: 'inventory',
      align: 'right',
      width: 100,
    },
    {
      title: 'ĐVT',
      dataIndex: 'unit_name',
      align: 'left',
      width: 100,
    },
  ];

  const record = ref<any>();
  const dataTable = ref<any[]>([]);

  /**
   * @description useModalInner
   */
  const [registerModal] = useModalInner(async (data) => {
    record.value = data;
    if (data?.capacity !== data?.remain) {
      dataTable.value = Array.from({ length: getRandomNumber(3, 9) }, () => ({
        material_name: getRandomMaterial(),
        inventory: getRandomNumber(),
        unit_name: 'chiếc',
      }));
    } else {
      dataTable.value = [];
    }
  });

  function getRandomNumber(min = 50, max = 500) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomMaterial() {
    const materials = [
      'Tấm kẹp trên thép TUTU-001 (40x60x55)',
      'Phôi thép TUTU-001 (40x60x55)',
      'Tấm kẹp dưới thép OPFE-16176 (40x50x55)',
      'Tấm kẹp trên thép EDTO-10412 (40x50x55)',
      'Tấm kẹp dưới thép CQBL-382 (40x60x55)',
      'Tấm kẹp dưới thép EFYD-5613 (40x50x55)',
      'Tấm kẹp trên thép YGIU-13715 (60x60x55)',
      'Tấm kẹp dưới thép BBQB-228 (40x60x55)',
      'Tấm kẹp dưới thép ULLI-1400 (40x60x55)',
      'Tấm kẹp trên thép LFYC-0613 (40x60x55)',
      'Tấm kẹp dưới thép DIOD-41516 (30x70x50)',
      'Tấm vỏ trên thép BYAA-2131 (30x70x50)',
      'Tấm kẹp trên thép EEGF-5107 (40x50x55)',
      'Tấm vỏ trên thép UPRD-141711 (40x50x55)',
      'Tấm kẹp dưới thép PIET-171510 (40x50x55)',
      'Tấm kẹp trên thép BORG-21611 (40x50x55)',
      'Tấm vỏ trên thép FFWY-669 (40x60x55)',
      'Tấm kẹp dưới thép AIEO-1155 (60x60x55)',
      'Tấm vỏ trên thép DADU-414 (40x50x55)',
    ];
    const randomIndex = Math.floor(Math.random() * materials.length);
    return materials[randomIndex];
  }
</script>
