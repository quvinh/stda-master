<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="
      dataMaterialExportItem?.material_id
        ? `Quét mã Pallet - SL.YC: ${formatNumber(dataMaterialExportItem?.quantity)} - NVL:${dataMaterialExportItem?.material_id}`
        : 'Quét mã Pallet'
    "
    :ok-text="isSeparate ? 'Xác nhận và in tem' : 'Xác nhận'"
    :show-ok-btn="!isConfirmed"
    style="top: 10px"
    @ok="handleFinish"
    @cancel="handleCancle"
  >
    <div>
      <div class="flex flex-col" v-if="dataMaterialExportItem?.id">
        <template v-if="palletsSuggest.length > 0">
          <span class="underline">Gợi ý Pallet cần xuất:</span>
          <ul class="list-disc pl-5">
            <li v-for="(suggest, index) in palletsSuggest" :key="index">
              <span
                >Mã Pallet <span class="font-700">{{ suggest?.pallet?.id }}</span> SL
                {{ Number(suggest?.quantity) }} - Vị trí:
                <span class="font-700">{{ suggest?.warehouse_location_id }}</span></span
              >
            </li>
          </ul>
        </template>
      </div>
      <template v-if="!isSeparate">
        <div :style="{ height: qrCodeHeight + 'px' }">
          <Html5QrcodePlugin
            ref="qrCodePluginRef"
            :fps="10"
            :qrbox="250"
            :disableFlip="true"
            :qrCodeSuccessCallback="handleScanResult"
          />
        </div>
      </template>
      <Table
        class="mt-1"
        size="small"
        :columns="columnScanner"
        :data-source="dataScanner"
        :pagination="false"
        :locale="{ emptyText: 'Chưa quét dữ liệu' }"
        :scroll="{ x: 500 }"
        bordered
      />
      <Table
        v-if="isSeparate"
        class="pt-1"
        :title="titleTableSeparate"
        size="small"
        :columns="columnSeparate"
        :data-source="dataSeparate"
        :pagination="false"
        :locale="{ emptyText: '' }"
        :scroll="{ x: 500 }"
        bordered
      />
      <div class="pt-1" v-if="isMissing">
        <Alert
          show-icon
          type="warning"
          :message="`Cảnh báo: còn thiếu ${dataMissing?.quantity} ${dataMissing?.unit_name}`"
        />
      </div>

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
  import Html5QrcodePlugin from '@/components/Html5Qrcode/Html5QrcodePlugin.vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Alert, Table, message } from 'ant-design-vue';
  import { h, ref } from 'vue';
  import { getApi as getPallet } from '@/api/sys/pallet';
  import { createWarehouseHistory, searchWarehouseEntry } from '@/api/sys/warehouse';
  import { getMaterialExportItemApi } from '@/api/sys/warehouse-location';
  import { formatNumber } from '@/utils/helper/tsxHelper';

  interface IHtmlContent {
    html: string;
    width: number;
    height: number;
  }

  const columnScanner: any[] = [
    { title: 'Mã Pallet', dataIndex: 'pallet_id', align: 'left', fixed: 'left', width: 120 },
    {
      title: 'SL Pallet',
      dataIndex: 'quantity_total',
      align: 'left',
      width: 100,
      customRender: ({ value }) => formatNumber(value),
    },
    {
      title: 'SL xuất',
      dataIndex: 'quantity_1',
      align: 'left',
      width: 100,
      customRender: ({ value }) => formatNumber(value),
    },
    { title: 'ĐVT', dataIndex: 'unit_name_1', align: 'left', width: 90 },
    {
      title: 'Vị trí',
      dataIndex: 'warehouse_location_id',
      align: 'left',
      fixed: 'right',
      width: 100,
    },
  ];

  const columnSeparate: any[] = [
    // {
    //   title: 'STT',
    //   dataIndex: 'no',
    //   align: 'left',
    //   width: 60,
    //   customRender: ({ index }) => index + 1,
    // },
    { title: 'Mã NVL', dataIndex: 'material_id', align: 'left', fixed: 'left', width: 120 },
    {
      title: 'Số lượng',
      dataIndex: 'quantity_1',
      align: 'left',
      width: 60,
      customRender: ({ value }) => formatNumber(value),
    },
    { title: 'ĐVT', dataIndex: 'unit_name_1', align: 'left', width: 60 },
    { title: 'Ghi chú', dataIndex: 'note', align: 'left', fixed: 'right', width: 100 },
    // {
    //   title: 'Thao tác',
    //   dataIndex: 'action',
    //   align: 'center',
    //   fixed: 'right',
    //   width: 90,
    //   customRender: ({ record }) =>
    //     h(
    //       Button,
    //       {
    //         size: 'small',
    //         type: 'primary',
    //         onClick: () => handlePrintSeparate(record),
    //       },
    //       'In tem',
    //     ),
    // },
  ];

  const emit = defineEmits(['success']);

  const qrCodePluginRef = ref<any>(null);
  const qrCodeHeight = ref<number>(300);
  const resizeObserver = ref<ResizeObserver | null>(null);
  const isScanningRef = ref<boolean>(true);
  const dataScanner = ref<
    {
      pallet_id: string;
      quantity_1: number;
      quantity_total: number;
      unit_id?: string;
      unit_name_1?: string;
      warehouse_location_id?: string;
      material_export_id?: string;
    }[]
  >([]);
  const materialExport = ref<any[]>([]);
  const materialExportId = ref<string | undefined>();
  const isSeparate = ref<boolean>(false);
  const isMissing = ref<boolean>(false);
  const dataSeparate = ref<any[]>([]);
  const htmlContent = ref<IHtmlContent | null>(null);
  const labelRef = ref<HTMLDivElement | null>(null);
  const isConfirmed = ref<boolean>(false);
  const dataMaterialExportItem = ref<any>();
  const palletsSuggest = ref<any[]>([]);
  const stepScanner = ref<'pallet_id' | 'warehouse_location_id'>('pallet_id');
  const quantityNeedExport = ref<number>(0);
  const dataMissing = ref<{ quantity: number; unit_name: string }>();

  /**
   * @description useModalInner
   */
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    const qrCodeElement = qrCodePluginRef.value?.$el;
    if (qrCodeElement) {
      resizeObserver.value = new ResizeObserver(() => {
        if (qrCodeElement.offsetHeight > 0) qrCodeHeight.value = Number(qrCodeElement.offsetHeight);
      });
      resizeObserver.value.observe(qrCodeElement); // Bắt đầu theo dõi phần tử này
    }

    setModalProps({ loading: true, confirmLoading: true });
    console.log(data);
    stepScanner.value = 'pallet_id';
    qrCodePluginRef.value?.resetScan();
    isSeparate.value = false;
    dataSeparate.value = [];
    dataMaterialExportItem.value = data?.record;
    quantityNeedExport.value = Number(data?.record?.quantity); // SL cần xuất từ phiếu xuất
    // await findPalletExportLocation(data?.record);
    if (data?.record?.export_pallets) {
      palletsSuggest.value = (data.record.export_pallets || []).filter(
        (item) => item?.id === data?.record?.key,
      );
    }
    if (data?.record?.id) {
      getSuggestPallets(data.record.id);
    }
    setModalProps({ loading: false, confirmLoading: false });
  });

  function titleTableSeparate() {
    return h('div', { class: 'font-semibold' }, 'Tách lẻ - In tem');
  }

  async function handleScanResult(value) {
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
      try {
        const jsonData = JSON.parse(value);
        switch (stepScanner.value) {
          case 'pallet_id':
            const response: any = await searchWarehouseEntry({ lot_id: jsonData.value });
            if (response && response.length > 0) {
              const record: any = response[0];
              const resPallet: any = await getPallet(jsonData.value);
              if (resPallet?.id) {
                if (resPallet?.material_id === dataMaterialExportItem.value?.material_id) {
                  const quantityPallet = Number(resPallet?.quantity_1);
                  if (quantityPallet > 0) {
                    const result: any = {};
                    result.pallet_id = resPallet.id;
                    result.quantity_total = quantityPallet; // Số lượng của Pallet
                    result.quantity_1 = quantityPallet; // Số lượng cần
                    result.unit_id_1 = resPallet.unit_id_1;
                    result.unit_name_1 = resPallet.unit1?.unit_name;
                    result.warehouse_location_id = record?.warehouse_location_id;
                    result.lot_no = resPallet.lot_no;
                    result.material_export_id = dataMaterialExportItem.value?.material_export?.id;
                    await dataScanner.value.push(result);

                    // Lấy tổng số lượng pallets vừa scan
                    const quantityPalletFromList: number = dataScanner.value.reduce(
                      (a, b) => a + Number(b?.quantity_1),
                      0,
                    );

                    // Check số lượng scanner
                    if (quantityPalletFromList === quantityNeedExport.value) {
                      isSeparate.value = false;
                      isMissing.value = false;
                      dataSeparate.value = [];
                      dataMissing.value = undefined;
                    } else if (quantityPalletFromList > quantityNeedExport.value) {
                      const inventoryQuantity: number =
                        quantityPalletFromList - quantityNeedExport.value;
                      if (quantityPallet - inventoryQuantity) {
                        isSeparate.value = true;
                        isMissing.value = false;
                        dataMissing.value = undefined;

                        dataScanner.value = dataScanner.value.map((item) => {
                          if (item.pallet_id === resPallet.id) {
                            result.quantity_1 = quantityPallet - inventoryQuantity;
                            return { ...item, quantity_1: quantityPallet - inventoryQuantity };
                          }
                          return item;
                        });

                        dataSeparate.value = [
                          {
                            material_id: resPallet?.material_id,
                            quantity_1: quantityPallet - inventoryQuantity,
                            unit_name_1: resPallet.unit1?.unit_name,
                            main: result,
                            note: 'XUẤT',
                          },
                          {
                            material_id: resPallet?.material_id,
                            quantity_1: inventoryQuantity,
                            unit_name_1: resPallet.unit1?.unit_name,
                            main: result,
                            note: 'TỒN',
                          },
                        ];
                      }
                    } else if (quantityPalletFromList < quantityNeedExport.value) {
                      isMissing.value = true;
                      isSeparate.value = false;
                      dataMissing.value = {
                        quantity: quantityNeedExport.value - quantityPalletFromList,
                        unit_name: resPallet.unit1?.unit_name,
                      };
                    } else {
                      throw new Error('Quantity Invalid!');
                    }

                    console.log(quantityPallet, quantityPalletFromList);
                  }
                } else message.info('KHÔNG ĐÚNG PALLET NGUYÊN VẬT LIỆU!');
              }
            } else message.info('KHÔNG LẤY ĐƯỢC VỊ TRÍ PALLET');
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        isScanningRef.value = true;
      }, 2500);
    }
  }

  async function handleCancle() {
    dataScanner.value = [];
    materialExport.value = [];
    materialExportId.value = undefined;
    setTimeout(async () => {
      await qrCodePluginRef.value?.stopScan();
      closeModal();
    }, 100);
  }

  async function handleFinish() {
    if (isMissing.value) {
      message.warning(
        `Cảnh báo: còn thiếu ${dataMissing.value?.quantity} ${dataMissing.value?.unit_name}`,
      );
      return;
    }

    if (dataScanner.value?.length > 0) {
      const payload: any = {};
      payload.type = 'export';
      payload.material_export_item_id = dataMaterialExportItem.value?.id;
      payload.pallets = dataScanner.value;
      const res = await createWarehouseHistory(payload);
      if (res) {
        handleCancle();
        emit('success', { ...res });
      } else message.error('Thao tác thất bại');
    } else message.info('KHÔNG CÓ DỮ LIỆU PALLET');
  }

  // async function handlePrintSeparate(record: any) {
  //   try {
  //     const response = await printPalletSeparate({
  //       pallet_id: record?.main?.pallet_id,
  //       quantity_1: record?.quantity_1,
  //     });
  //     if (response) {
  //       htmlContent.value = response;
  //       setTimeout(async () => {
  //         if (!labelRef.value || !htmlContent.value?.html) return;
  //         const style: string = `
  //             @page {
  //               size: ${htmlContent.value?.width}mm ${htmlContent.value?.height}mm;
  //               margin: 0;
  //             }
  //             @media print {
  //               .label-print {
  //                 display: flex;
  //                 flex-direction: column;
  //                 align-items: center;
  //                 justify-content: center;
  //                 width: 100% !important;
  //                 height: 100% !important;
  //               }
  //             }
  //           `;
  //         printJS({
  //           printable: labelRef.value.outerHTML,
  //           type: 'raw-html',
  //           targetStyles: ['*'],
  //           style,
  //         });
  //       }, 500);
  //     }
  //   } catch (error) {
  //     message.error(error.message);
  //   } finally {
  //     // loading
  //   }
  // }

  async function getSuggestPallets(id) {
    const res: any = await getMaterialExportItemApi(id);
    if (res) {
      palletsSuggest.value = res;
    }
  }
</script>
