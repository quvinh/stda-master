<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Tạo Pallet"
    @cancel="handleCancle"
    @ok="handleSubmit"
    style="top: 10px"
  >
    <div class="flex flex-col">
      <div :style="{ height: qrCodeHeight + 'px' }">
        <Html5QrcodePlugin
          ref="qrCodePluginRef"
          :fps="10"
          :qrbox="250"
          :disableFlip="true"
          :qrCodeSuccessCallback="handleScanResult"
        />
      </div>
      <Table
        class="mt-1"
        size="small"
        :columns="columns"
        :dataSource="dataMerge"
        :bordered="true"
        :pagination="false"
        :scroll="{ x: 500, y: 250 }"
        :locale="{ emptyText: 'Không có dữ liệu Pallet' }"
      />
    </div>
    <div class="hidden">
      <div ref="labelRef">
        <div v-html="htmlContent?.html"></div>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { getLotApi } from '@/api/sys/lot';
  import { printMergeLots } from '@/api/sys/print';
  import { mergeLotsApi } from '@/api/sys/production-plan';
  import Html5QrcodePlugin from '@/components/Html5Qrcode/Html5QrcodePlugin.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ProcessType } from '@/enums/processType';
  import { formatNumber } from '@/utils/helper/tsxHelper';
  import { Button, message, Table } from 'ant-design-vue';
  import { ColumnType } from 'ant-design-vue/es/table';
  import printJS from 'print-js';
  import { h, ref } from 'vue';

  interface IHtmlContent {
    html: string;
    width: number;
    height: number;
  }

  const emit = defineEmits(['success']);

  const labelRef = ref<HTMLDivElement | null>(null);
  const htmlContent = ref<IHtmlContent | null>(null);
  const qrCodePluginRef = ref<any>(null);
  const qrCodeHeight = ref<number>(300);
  const resizeObserver = ref<ResizeObserver | null>(null);
  const isScanningRef = ref<boolean>(true);
  const dataMerge = ref<any[]>([]);
  const equipmentId = ref<string>();
  const columns = ref<ColumnType[]>([
    {
      title: 'STT',
      dataIndex: 'stt',
      fixed: 'left',
      width: 50,
      customRender: ({ index }) => index + 1,
    },
    {
      title: 'Mã Pallet',
      dataIndex: 'id',
      width: 150,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_id',
      width: 120,
    },
    {
      title: 'SL',
      dataIndex: 'actual_quantity',
      width: 80,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'Thao tác',
      fixed: 'right',
      width: 60,
      customRender: ({ record }) =>
        h(
          Button,
          {
            type: 'link',
            danger: true,
            onClick: () => handleRemoveRow(record),
          },
          h(Icon, { icon: 'ant-design:delete-outlined' }),
        ),
    },
  ]);

  /**
   * @description useModalInner
   */
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    const qrCodeElement = qrCodePluginRef.value?.$el;
    if (qrCodeElement) {
      resizeObserver.value = new ResizeObserver(() => {
        if (qrCodeElement.offsetHeight > 0) qrCodeHeight.value = Number(qrCodeElement.offsetHeight);
      });
      resizeObserver.value.observe(qrCodeElement); // Bắt đầu theo dõi phần tử này
    }

    dataMerge.value = [];
    qrCodePluginRef.value?.resetScan();
    if (data?.equipment_id) {
      equipmentId.value = data.equipment_id;
    }
  });

  function handleCancle() {
    if (resizeObserver.value && qrCodePluginRef.value?.$el) {
      resizeObserver.value.disconnect(); // Ngừng theo dõi khi component bị hủy
    }
    qrCodePluginRef.value?.stopScan();
    closeModal();
  }

  async function handleScanResult(value) {
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
      try {
        // qrCodePluginRef.value.resetScan();
        // const res: any = await getOiManufactureRunningLotApi({
        //   lot_id: value,
        //   equipment_id: equipmentId.value,
        // });
        // if (res && res?.length > 0) {
        //   const lot = res[0];
        //   if (lot?.status_code === 'completed') {
        //     if (lot?.parent_lot_id) {
        //       message.info(`PALLET ${lot?.lot_id} ĐÃ GỘP!`);
        //     } else {
        //       const check = dataMerge.value.find((item) => item?.lot_id === lot?.lot_id);
        //       if (!check) {
        //         dataMerge.value.push(lot);
        //       }
        //     }
        //   } else if (lot?.lot_id) {
        //     message.info(`PALLET ${lot?.lot_id ?? ''} CHƯA HOÀN THÀNH!`);
        //   }
        // }
        const res: any = await getLotApi(value);
        if (res?.id) {
          if (res?.parent_id) {
            message.info(`PALLET ${res.id} ĐÃ GỘP!`);
          } else {
            if (res?.process_id === ProcessType.PACKING) {
              const check = dataMerge.value.find((item) => item?.lot_id === res.id);
              if (!check) {
                dataMerge.value.push(res);
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        isScanningRef.value = true;
      }, 2500);
    }
  }

  function handleRemoveRow(record: any) {
    dataMerge.value = dataMerge.value.filter((item) => item?.lot_id !== record?.lot_id);
  }

  async function handleSubmit() {
    if (dataMerge.value.length > 0) {
      console.log(dataMerge.value);
      const res: any = await mergeLotsApi({
        lot_ids: dataMerge.value.map((item) => String(item?.id)),
        equipment_id: equipmentId.value,
      });

      if (res?.id) {
        // Print lot
        const response: any = await printMergeLots({
          lot_ids: [res.id],
        });
        if (response) {
          const { html, width, height } = response;
          htmlContent.value = {
            html: html,
            width: width ?? 100,
            height: height ?? 60,
          };
          setTimeout(async () => {
            if (!labelRef.value || !htmlContent.value?.html) {
              message.info('Không thể in tem');
              return;
            }
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

        emit('success', {});
        handleCancle();
      }
    } else {
      message.warn('GỘP ÍT NHẤT 1 PALLET!');
    }
  }
</script>
