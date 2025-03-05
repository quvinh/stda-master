<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="In tem"
    ok-text="Xác nhận"
    :show-ok-btn="false"
    @cancel="handleCancle"
  >
    <div>
      <Table
        size="small"
        :columns="columnParent"
        :data-source="Object.values(dataParent ?? {}).length > 0 ? [dataParent] : []"
        :pagination="false"
        :locale="{ emptyText: 'Chưa quét dữ liệu' }"
        :scroll="{ x: 400 }"
        bordered
      />
      <Table
        class="pt-1"
        :title="titleTableSeparate"
        size="small"
        :columns="columnSeparate"
        :data-source="dataSeparate"
        :pagination="false"
        :locale="{ emptyText: '' }"
        :scroll="{ x: 400 }"
        bordered
      />

      <div class="hidden">
        <div ref="labelRef">
          <!-- Safely renders HTML content -->
          <div v-html="htmlContent?.html"></div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Button, Table, message } from 'ant-design-vue';
  import { h, ref } from 'vue';
  import { printPallet } from '@/api/sys/print';
  import printJS from 'print-js';

  interface IHtmlContent {
    html: string;
    width: number;
    height: number;
  }

  const columnParent: any[] = [
    { title: 'Mã Pallet', dataIndex: 'pallet_id', align: 'center', width: 120 },
    { title: 'Mã NVL', dataIndex: 'material_id', align: 'center', width: 120 },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
      width: 90,
      customRender: ({ value }) => Number(value),
    },
    { title: 'ĐVT', dataIndex: 'unit_name', align: 'center', width: 90 },
  ];

  const columnSeparate: any[] = [
    {
      title: 'STT',
      dataIndex: 'no',
      align: 'center',
      width: 60,
      customRender: ({ index }) => index + 1,
    },
    { title: 'Mã Pallet', dataIndex: 'id', align: 'center', width: 120 },
    {
      title: 'Số lượng',
      dataIndex: 'quantity_1',
      align: 'center',
      width: 90,
      customRender: ({ value }) => Number(value),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      align: 'center',
      fixed: 'right',
      width: 90,
      customRender: ({ record }) =>
        h(
          Button,
          {
            size: 'small',
            type: 'primary',
            loading: loading.value,
            onClick: () => handlePrintSeparate(record),
          },
          'In tem',
        ),
    },
  ];

  const dataParent = ref<{
    pallet_id: string;
    material_id: number;
    quantity?: string;
    unit_name?: string;
  }>();
  const materialExport = ref<any[]>([]);
  const materialExportId = ref<string | undefined>();
  const dataSeparate = ref<any[]>([]);
  const htmlContent = ref<IHtmlContent | null>(null);
  const labelRef = ref<HTMLDivElement | null>(null);
  const loading = ref<boolean>(false);

  /**
   * @description useModalInner
   */
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    if (data?.pallet?.parent?.childrens) {
      dataSeparate.value = data.pallet.parent.childrens;
      dataParent.value = {
        pallet_id: data.pallet.parent?.id,
        material_id: data.pallet.parent?.material_id,
        quantity: data.pallet.parent?.quantity_1,
        unit_name: data.pallet.parent?.unit1?.unit_name,
      };
    } else {
      //
    }
  });

  function titleTableSeparate() {
    return h('div', { class: 'font-semibold' }, 'Tách lẻ - In tem');
  }

  function handleCancle() {
    dataParent.value = undefined;
    materialExport.value = [];
    materialExportId.value = undefined;
    closeModal();
  }

  async function handlePrintSeparate(record: any) {
    try {
      loading.value = true;
      const response = await printPallet({
        pallet_ids: [record?.id],
      });
      if (response) {
        htmlContent.value = response;
        setTimeout(async () => {
          if (!labelRef.value || !htmlContent.value?.html) return;
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
    } catch (error) {
      message.error(error.message);
    } finally {
      loading.value = false;
    }
  }
</script>
