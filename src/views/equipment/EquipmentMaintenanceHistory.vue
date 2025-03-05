<template>
  <div class="flex pt-1">
    <div class="hidden lg:block w-[270px] mr-1">
      <EquipmentMaintenanceHistorySidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: '85%' }"
        size="small"
        title="Kế hoạch bảo dưỡng thiết bị"
      >
        <template #extra>
          <Button type="primary" size="small" @click="exportData"
            ><Icon icon="ant-design:download-outlined" /> Xuất Excel</Button
          >
        </template>
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'phu_tung_thay_the'">
              <Button @click="() => handleUpdate(record)">Xem chi tiết</Button>
            </template>
          </template>
        </BasicTable>
      </Card>
      <EquipmentMaintenanceHistoryModal :width="800" :draggable="false" @register="registerModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { Button, message, Card } from 'ant-design-vue';
  import { useModal } from '@/components/Modal';
  import { onMounted, ref } from 'vue';
  import { searchApi, exportExcelData } from '@/api/sys/equipment-maintenance-histories';
  import { getBasicColumns } from './components/EquipmentMaintenanceHistory/tableDataEquipmentMaintenanceHistory';
  import EquipmentMaintenanceHistorySidebar from './components/EquipmentMaintenanceHistory/EquipmentMaintenanceHistorySidebar.vue';
  import EquipmentMaintenanceHistoryModal from './components/EquipmentMaintenanceHistory/EquipmentMaintenanceHistoryModal.vue';
  import dayjs from 'dayjs';
  import { IPagination } from '@/store/types/pagination';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { IEquipmentMaintenanceHistories } from '@/api/model/IEquipmentMaintenanceHistories';

  const data = ref<IEquipmentMaintenanceHistories[]>([]);

  type Spareparts = {
    stt: number;
    sparepartsName: string;
    quantity: number;
  };

  const loading = ref<boolean>(false);

  const [registerModal, { openModal }] = useModal();
  const page = ref<number>(1);
  const pageSize = ref<number>(20);

  const totalPage = ref<number>(0);
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
    maintenanceType: data,
  });

  const [registerTable, { setPagination }] = useTable({
    // title: 'Lịch sử bảo dưỡng thiết bị',
    dataSource: data,
    columns: getBasicColumns(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    pagination: false,
    handleSearchInfoFn,
  });

  onMounted(() => {
    fetchData({ page: page.value, pageSize: pageSize.value });
  });

  function handleSearchInfoFn(info) {
    page.value = 1;
    fetchData(info);
  }

  async function handleUpdate(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

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

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchData({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchData({ page: page.value, pageSize: size, ...filter.value });
  }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      const { data: resource, pagination } = await searchApi(param);
      if (resource) {
        data.value = resource?.map((i) => {
          const startTime = new Date(i.maintenance_plan.start_time);
          const endTime = new Date(i.maintenance_plan.end_time);

          const diffInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
          var sparepartsData: Spareparts[] = [];
          const spareparts = i.spareparts;
          for (let i = 0; i < spareparts.length; i++) {
            sparepartsData.push({
              stt: i + 1,
              sparepartsName: spareparts[i].material.material_name,
              quantity: spareparts[i].quantity,
            });
          }
          return {
            maintenanceDate: i.maintenance_plan.maintenance_date,
            maintenanceId: i.maintenance_plan_id,
            equipmentName: i.maintenance_plan.equipment.equipment_name,
            maintenanceUnit: i.maintenance_plan.maintenance_unit,
            maintenanceCategory: i.maintenance_plan.maintenance_type,
            maintenanceContent: i.maintenance_plan.notes,
            explain: i.maintenance_plan.explain,
            maintenanceUser: i.maintenance_plan.user.name,
            maintenanceTime: `${diffInMinutes} phút`,
            spareparts: sparepartsData,
          };
        });

        console.log(data.value);

        //Set pagination
        const paginate: IPagination = pagination ?? null;
        let totalRecord = data.value.length;
        if (paginate) totalRecord = paginate.total;
        paginationProp.value.current = page.value ?? 1;
        paginationProp.value.total = totalRecord ?? 0;
        paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
        setPagination(paginationProp.value);
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleSidebarFilter(values) {
    // console.log(values);
    filter.value = values;
    fetchData(values);
  }

  async function exportData() {
    try {
      const response: any = await exportExcelData();
      const { data, type, file } = response;
      try {
        if (data && type && file) {
          downloadExcel(data, type, file);
        } else message.error('Data invalid!');
      } catch (error) {
        console.log(error);
        message.error((error as Error).message);
      }
    } catch (e) {
      message.error('Error exporting processes:', e);
    }
  }
</script>
