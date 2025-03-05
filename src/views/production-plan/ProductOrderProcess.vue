<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <ProductionOrderSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: '85%' }"
        size="small"
        title="Tiến độ thực hiện đơn hàng"
      >
        <template #extra>
          <Space>
            <Button class="mr-[10px]" size="small" type="primary">
              <Icon icon="ant-design:file-excel-outlined" />
              Xuất Excel
            </Button>
          </Space>
        </template>
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction
                :actions="[
                  {
                    // label: 'Sửa',
                    icon: 'ant-design:edit-outlined',
                    disabled: record?.status === 'pending' ? false : true,
                    onClick: handleUpdate.bind(null, record),
                  },
                  {
                    // label: 'Xóa',
                    icon: 'ant-design:delete-outlined',
                    color: 'error',
                    disabled: record?.status === 'pending' ? false : true,
                    popConfirm: {
                      title: 'Xác nhận xóa?',
                      placement: 'topLeft',
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
      </Card>
      <ProductOrderModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IProductionOrder } from '@/api/model/IProductionOrder';
  import { deleteProductOrderApi, searchProductOrderApi } from '@/api/sys/production-order';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import ProductOrderModal from '@/views/master-data/productOrder/components/ProductOrderModal.vue';
  import { Button, Card, message, Space } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { onMounted, ref } from 'vue';
  import { getBasicColumnsProcess, mockDataProcess } from './components/tableData';
  import ProductionOrderSidebar from './ProductionOrderSidebar.vue';

  const productOrders = ref<IProductionOrder[]>([]);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const totalPage = ref<number>(0);
  const filter = ref<object>({});
  const paginationProp = ref<PaginationProps | any>({
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    current: page,
    total: totalPage,
    pageSizeOptions,
    showTotal: (totalPage: number) => `Total ${totalPage} items`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setPagination }] = useTable({
    dataSource: productOrders,
    columns: getBasicColumnsProcess(),
    useSearchForm: false,
    // actionColumn: getActionColumn(),
    showTableSetting: false,
    showIndexColumn: true,
    indexColumnProps: { fixed: 'left' },
    rowKey: 'id',
    bordered: true,
    loading,
  });

  onMounted(() => {
    // fetchProductOrder({ page: page.value, pageSize: pageSize.value });
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchProductOrder({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchProductOrder({ page: page.value, pageSize: size, ...filter.value });
  }

  async function fetchProductOrder(param: any = {}) {
    try {
      loading.value = true;
      // if (!param?.customer_id) param.customer_id = null;
      // if (!param?.product_id) param.product_id = null;
      // const response: any = await searchProductOrderApi(param);
      // const productOrderData = response.data ?? [];
      // productOrders.value = productOrderData;

      // const pagination: IPagination = response?.pagination ?? null;
      // let totalRecord = productOrders.value.length;
      let totalRecord = mockDataProcess.length;
      // if (pagination) totalRecord = pagination.total;
      paginationProp.value.current = page.value ?? 1;
      paginationProp.value.total = totalRecord ?? 0;
      paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
      setPagination(paginationProp.value);
      productOrders.value = mockDataProcess;
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  /**
   * @description action update, open model
   */
  async function handleUpdate(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  function handleSidebarFilter(values: any) {
    filter.value = values;
    console.log(values);
    fetchProductOrder(values);
  }

  async function handleDelete(record: Recordable) {
    try {
      const result = await deleteProductOrderApi(record?.id);
      if (result) {
        fetchProductOrder({ page: page.value, pageSize: pageSize.value });
        message.success('Xóa thành công');
      } else {
        message.error('Xóa thất bại');
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  function handleSuccess(result: any) {
    console.log(result);
    fetchProductOrder({ page: page.value, pageSize: pageSize.value });
  }
</script>
