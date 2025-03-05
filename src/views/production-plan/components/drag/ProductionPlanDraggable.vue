<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <ProductionPlanSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <div class="flex flex-col h-full">
        <div class="h-[30px] flex justify-between items-center">
          <span class="font-bold ml-1">Kế hoạch sản xuất</span>
          <Space class="mr-1">
            <Button size="small" :href="`${BACKEND_URL}/excel/KeHoachSanXuat.xlsx`">
              <Icon icon="ant-design:download-outlined" />
              File mẫu
            </Button>
            <Upload
              action="/v1/import-production-plans"
              name="file"
              accept=".xlsx"
              :showUploadList="false"
              :loading="uploading"
              :headers="{
                Authorization: String(getToken() ?? ''),
              }"
              :data="{}"
              @change="handleUploadChange"
            >
              <a-button type="primary" size="small">
                <Icon icon="ant-design:upload-outlined" />
                Upload file
              </a-button>
            </Upload>
            <Button type="primary" size="small" @click="exportData">
              <Icon icon="ant-design:download-outlined" />
              Xuất Excel
            </Button>
          </Space>
        </div>
        <div class="h-[calc(100%-35px)] flex flex-col">
          <div class="h-3/7">
            <ProductionGranttChart />
          </div>
          <div class="h-4/7 flex flex-col">
            <DraggableTable
              :columns="columns"
              :dataSource="data"
              :pagination="paginationProp"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </div>
    </div>
    <EditProductionPlanModal
      :width="500"
      :draggable="false"
      @register="registerModal"
      @success="handleSuccess"
    />
    <ViewProductionPlanModal
      :width="1000"
      :draggable="false"
      @register="registerViewModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import { exportExcelData, searchApi } from '@/api/sys/production-plan';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { Button, message, Space, Upload } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { useLoading } from '@/components/Loading';
  import dayjs from 'dayjs';
  import { onMounted, ref } from 'vue';
  import EditProductionPlanModal from '../EditProductionPlanModal.vue';
  import ProductionGranttChart from '../ProductionGranttChart.vue';
  import ProductionPlanSidebar from '../ProductionPlanSidebar.vue';
  import ViewProductionPlanModal from '../ViewProductionPlanModal.vue';
  import DraggableTable from './DraggableTable.vue';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const [openFullLoading, closeFullLoading] = useLoading({
    tip: 'Vui lòng đợi...',
  });

  const columns = ref<any[]>([
    { title: '#', dataIndex: '#', width: 50, align: 'center' },
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Tên công đoạn', dataIndex: 'process_id', width: 150 },
    { title: 'Mã máy', dataIndex: 'equipment_id', width: 150 },
    { title: 'Mã sản phẩm', dataIndex: 'product_id', width: 150 },
    { title: 'Mã khách hàng', dataIndex: 'customer_id', width: 150 },
    { title: 'Mã lô sản xuất', dataIndex: 'batch_id', width: 150 },
    { title: 'Part No', dataIndex: 'product_name', width: 250 },
    { title: 'PO/ Biên nhận', dataIndex: 'order_id', width: 150 },
    { title: 'Số lượng đặt', dataIndex: 'quantity', width: 150 },
    { title: 'Thời gian bắt đầu', dataIndex: 'start_time', width: 150 },
    { title: 'Thời gian kết thúc', dataIndex: 'end_time', width: 150 },
    { title: 'Thời gian upload', dataIndex: 'created_at', width: 150 },
    { title: 'Trạng thái', dataIndex: 'status', width: 120 },
    { title: 'Thao tác', dataIndex: 'action', align: 'center', width: 100 },
  ]);
  const data = ref<any[]>([]);

  const loading = ref<boolean>(false);
  const uploading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const [registerModal] = useModal();
  const [registerViewModal] = useModal();
  const totalPage = ref<number>(0);
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
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  onMounted(() => {
    fetchData({ page: page.value, pageSize: pageSize.value });
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
      openFullLoading();
      const { data: resource, pagination } = await searchApi(param);
      if (resource) {
        console.log(resource);
        data.value = (resource || []).map((item) => ({
          id: item.id,
          process_id: item.process_id,
          equipment_id: item.equipment_id,
          product_id: item.product_id,
          customer_id: item.customer_id,
          batch_id: item.batch_id,
          product_name: item.product?.product_name,
          order_id: item.batch_id,
          quantity: item.quantity,
          status: item.status,
          start_time: item.start_time ? dayjs(item.start_time).format('DD/MM/YYYY HH:mm') : '-',
          end_time: item.end_time ? dayjs(item.end_time).format('DD/MM/YYYY HH:mm') : '-',
          created_at: item.created_at ? dayjs(item.created_at).format('DD/MM/YYYY HH:mm') : '-',
        }));

        // Set pagination
        const paginate: IPagination = pagination ?? null;
        let totalRecord = data.value.length;
        if (paginate) totalRecord = paginate.total;
        paginationProp.value.current = page.value ?? 1;
        paginationProp.value.total = totalRecord ?? 0;
        paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
        // setPagination(paginationProp.value);
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
      closeFullLoading();
    }
  }

  function handleSidebarFilter(values) {
    filter.value = values;
    fetchData(values);
  }

  function handleUploadChange(info: any) {
    try {
      if (info.file.status === 'uploading') {
        uploading.value = true;
      } else {
        if (info.file.status === 'done') {
          if (!info.file?.response?.success)
            throw new Error(
              info.file?.response?.message ?? `${info.file.name} - Thực hiện thất bại`,
            );
          message.success(`${info.file.name} - Upload thành công`);
          fetchData({ page: page.value, pageSize: pageSize.value });
        } else if (info.file.status === 'error') {
          message.error(info.file?.response?.message ?? `${info.file.name} - Thực hiện thất bại`);
        }
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      uploading.value = false;
    }
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

  function handleSuccess() {
    console.log('thanh cong');
  }

  function handleSizeChange({ current, pageSize: pz }: any) {
    page.value = current;
    pageSize.value = pz;
    fetchData({ page: current, pageSize: pz });
  }
</script>
