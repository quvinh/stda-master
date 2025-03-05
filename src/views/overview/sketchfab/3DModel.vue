<template>
  <div class="w-full h-[100vh] bg-black">
    <iframe
      v-if="modelId"
      ref="iframeRef"
      title="Factory Model"
      width="100%"
      height="100%"
      frameborder="0"
      allow="autoplay; fullscreen; vr"
      :src="`https://sketchfab.com/models/${modelId}/embed`"
    ></iframe>

    <Modal
      class="no-padding-modal"
      :style="{ top: '50px' }"
      :visible="isOpenModal"
      @cancel="closePopup"
      :footer="null"
      :width="850"
      :confirm-loading="!selectedNode"
      :mask="false"
    >
      <template #title>
        <div class="custom-modal-title">[GẤP DÁN 1] Áp suất giảm ({{ selectedDate.start }})</div>
      </template>
      <Descriptions bordered :column="1" :size="'middle'">
        <Descriptions.Item label="Giám sát bất thường" style="font-weight: 700">
          <span style="font-weight: 500">Hiện trạng: Áp suất giảm 3 lần liên tục</span>
          <br />
          <span style="font-weight: 500">
            Sức ảnh hưởng: Dự báo áp suất có thể vượt giới hạn kiểm soát, gây lỗi chất lượng</span
          >
        </Descriptions.Item>
        <Descriptions.Item :span="1" label="Hướng dẫn xử lý" style="font-weight: 700">
          <span style="font-weight: 500"> [Machine] Kiểm tra đường dẫn khí nén </span>
          <br />
          <span style="font-weight: 500">[Machine] Kiểm tra va cấp khí nén bị hỏng</span>
          <br />
          <span style="font-weight: 500"
            >[Machine] Kiểm tra máy cấp khí có hoạt động hay không</span
          >
        </Descriptions.Item>
      </Descriptions>
    </Modal>
    <Modal
      class="no-padding-modal"
      :style="{ top: '50px' }"
      :visible="isOpenModalResult"
      :footer="null"
      :width="850"
      :confirm-loading="!selectedNode"
      :mask="false"
      :closable="false"
    >
      <template #title>
        <div class="custom-modal-title">Kết quả xử lý</div>
      </template>

      <Descriptions bordered :column="2" :size="'middle'">
        <Descriptions.Item label="Thời gian bắt đầu" style="font-weight: 700">
          {{ selectedDate.start }}</Descriptions.Item
        >
        <Descriptions.Item label="Thời gian kết thúc" style="font-weight: 700">
          {{ selectedDate.end }}</Descriptions.Item
        >
        <Descriptions.Item :span="2" label="Hướng dẫn xử lý" style="font-weight: 700">
          <span style="font-weight: 500"> [Machine] Kiểm tra đường dẫn khí nén </span>
          <br />
          <span style="font-weight: 500">[Machine] Kiểm tra va cấp khí nén bị hỏng</span>
          <br />
          <span style="font-weight: 500"
            >[Machine] Kiểm tra máy cấp khí có hoạt động hay không</span
          >
        </Descriptions.Item>
        <Descriptions.Item label="Kết quả xử lý" style="font-weight: 700">
          <Form>
            <Form.Item>
              <Textarea
                v-model="selectedData.result"
                :rows="4"
                placeholder="Nhập ghi chú bổ sung"
              />
            </Form.Item>
          </Form>
        </Descriptions.Item>
      </Descriptions>
      <div style="margin-top: 16px; text-align: right">
        <Button type="primary" @click="handleSaveResult">Lưu kết quả</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
  import { Modal, Descriptions, Form, Textarea, Button, message } from 'ant-design-vue';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import echo from '@/utils/echo';
  import axiosInstance from '@/api/resource/axiosInstance';
  import dayjs from 'dayjs';
  import { getConfigApi } from '@/api/sys/config';

  // Interface cho các mô hình
  interface IModels {
    cnc: any[];
    quality: any[];
    logistic: any[];
    production: any[];
    machine: any[];
  }

  const oiHeaderStore = useOIHeaderStore();

  const modelId = ref<string>();
  const iframeRef = ref<HTMLIFrameElement | null>(null);
  const client = ref<any | null>(null);
  const _nodes = ref<any>({});
  const selectedNode = ref<any>(null);
  const isOpenModal = ref(false);
  const isOpenModalResult = ref(false);
  const visibilityMap = ref<Record<string, boolean>>({});
  const selectedData = ref<any>({
    result: '', // Khởi tạo với một chuỗi rỗng để lưu kết quả
  });
  const selectedDate = ref<any>({
    start: '',
    end: '', // Khởi tạo với một chuỗi rỗng để lưu kết quả
  });

  const models = reactive<IModels>({
    cnc: [],
    quality: [],
    logistic: [],
    production: [],
    machine: [],
  });

  // Hàm khởi tạo
  onMounted(() => {
    oiHeaderStore.setTitle('CẢNH BÁO BẤT THƯỜNG');
    fetchData();
  });

  async function fetchData() {
    const response: any = await getConfigApi();
    if (response.options?.factory_model) {
      modelId.value = response.options.factory_model;
    } else message.error('Không có dữ liệu mô hình nhà máy!');

    // Setup
    setTimeout(() => {
      const iframe = iframeRef.value;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const sketchfabClient = new window.Sketchfab('1.12.1', iframe);

      sketchfabClient.init(modelId.value, {
        success: (api: any) => {
          client.value = api;
          api.start();
          api.addEventListener('viewerready', async function () {
            console.log('Viewer is ready');
            loadNodes(api);
            hideNodes(api);
          });
        },
        error: function onError() {
          console.error('Viewer error');
        },
      });
    }, 200);
  }

  // Hàm tải các nodes
  const loadNodes = (api: any) => {
    api.getNodeMap(async (err: any, nodes: any) => {
      if (!err) {
        _nodes.value = nodes;
        console.log('Nodes:', nodes, Object.values(nodes));
        await loadModels(nodes);
        setupNodeClick(api, nodes);
        initializeVisibilityMap(nodes);
        hideNode('33');
        hideNode('12');
        hideNode('44');
        hideNode('380');
      }
    });
  };
  const handleSaveResult = () => {
    console.log('Kết quả xử lý:', selectedData.value?.result);
    axiosInstance.post('/v1/abnormal', {
      result: selectedData.value?.result,
    });
    // isOpenModalResult.value = false;
  };
  // Hàm ẩn các node
  const hideNodes = (api: any) => {
    api.getNodeMap((err: any, nodes: any) => {
      if (!err) {
        const hideModels = [
          ...models.logistic,
          ...models.machine,
          ...models.production,
          ...models.quality,
        ];
        const instanceIdsToHide = hideModels.map((model) => model.instanceID);
        instanceIdsToHide.forEach((id) => {
          const node = nodes[id];
          if (node) api.hide(node.instanceID);
        });
      }
    });
  };

  // Hàm tải mô hình
  const loadModels = async (nodes: any) => {
    models.cnc = Object.values(nodes).filter((value: any) =>
      String(value?.name ?? '').startsWith('CNC'),
    );
    models.quality = Object.values(nodes).filter((value: any) =>
      String(value?.name ?? '').startsWith('QUALITY_CNC'),
    );
    models.logistic = Object.values(nodes).filter((value: any) =>
      String(value?.name ?? '').startsWith('LOGISTIC_CNC'),
    );
    models.production = Object.values(nodes).filter((value: any) =>
      String(value?.name ?? '').startsWith('PRODUCTION_CNC'),
    );
    models.machine = Object.values(nodes).filter((value: any) =>
      String(value?.name ?? '').startsWith('MACHINE_CNC'),
    );
  };

  // Thiết lập sự kiện click vào node
  const setupNodeClick = (api: any, nodes: any) => {
    api.addEventListener('click', (event: any) => {
      const nodeId = event.instanceID;
      console.log('Clicked node:', nodeId);
      const node: any = Object.values(nodes).find((node: any) => node.instanceID === nodeId);
      if (node) {
        const nodeName = node.name;
        const allModels = [
          ...models.cnc,
          ...models.logistic,
          ...models.machine,
          ...models.production,
          ...models.quality,
        ];
        const getModel = allModels.find((model: any) => {
          if (String(nodeName).startsWith(model?.name)) return true;
          const nodeChild = model.children?.find((item: any) =>
            String(nodeName).startsWith(item?.name),
          );
          return !!nodeChild;
        });
        if (getModel) {
          selectedNode.value = getModel;
          isOpenModal.value = true;
        }
      }
    });
  };

  // Khởi tạo bản đồ ẩn/hiện node
  const initializeVisibilityMap = (nodes: any) => {
    const visibility: Record<string, boolean> = {};
    const hideModels = [
      ...models.logistic,
      ...models.machine,
      ...models.production,
      ...models.quality,
    ];
    Object.values(nodes).forEach((node: any) => {
      if (!hideModels.find((model) => model.instanceID === node.instanceID)) {
        visibility[node.instanceID] = true; // Mặc định hiển thị tất cả
      }
    });
    visibilityMap.value = visibility;
  };

  // Đóng modal
  const closePopup = () => {
    isOpenModal.value = false;
    selectedNode.value = null;
  };

  const hideNode = (nodeId: any) => {
    if (client.value) {
      client.value.hide(nodeId);
      visibilityMap.value = {
        ...visibilityMap.value,
        [nodeId]: false,
      };
    }
  };

  const showNode = (nodeId: any) => {
    if (client.value) {
      client.value.show(nodeId);
      visibilityMap.value = {
        ...visibilityMap.value,
        [nodeId]: true,
      };
    }
  };
  // Chuyển đổi ẩn/hiện node
  const toggleVisibility = (nodeId: any) => {
    if (client.value) {
      const newVisibility = !visibilityMap.value[nodeId];
      if (newVisibility) {
        client.value.show(nodeId);
      } else {
        client.value.hide(nodeId);
      }
      visibilityMap.value = {
        ...visibilityMap.value,
        [nodeId]: newVisibility,
      };
    }
  };

  // Lấy ngẫu nhiên phần tử từ data
  const getRandomElement = (data: any[]) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  };

  function loadEchoInit() {
    echo.connector.socket.on('connect', () => {
      console.log('WebSocket connected!');
    });
    echo.channel('laravel_database_abnormalchannel').listen('.abnormal-event', (event: any) => {
      console.log(event?.abnormalData);
      const data = event?.abnormalData;
      if (data && data.status == 0) {
        selectedDate.value.start = dayjs(data?.created_at).format('DD/MM/YYYY HH:mm:ss');
        isOpenModal.value = true;
        showNode('33');
        showNode('12');
        showNode('44');
        showNode('380');
      } else if (data && data.status === 1) {
        selectedDate.value.start = dayjs(data?.created_at).format('DD/MM/YYYY HH:mm:ss');
        selectedDate.value.end = dayjs(data?.updated_at).format('DD/MM/YYYY HH:mm:ss');
        isOpenModal.value = false;
        isOpenModalResult.value = true;
        hideNode('33');
        hideNode('12');
        hideNode('44');
        hideNode('380');
      } else {
        isOpenModal.value = false;
        isOpenModalResult.value = false;
        selectedData.value.result = '';
        hideNode('33');
        hideNode('12');
        hideNode('44');
        hideNode('380');
      }
    });
  }
  // Cập nhật ngẫu nhiên mỗi 5 giây
  onMounted(() => {
    const interval = setInterval(() => {
      if (client.value) {
        const node1 = getRandomElement(models.machine);
        if (node1?.instanceID) toggleVisibility(node1.instanceID);
      }
    }, 5000);
    onUnmounted(() => clearInterval(interval));
    loadEchoInit();
  });

  onBeforeUnmount(() => {
    echo.leaveChannel('laravel_database_abnormalchannel');
  });
</script>

<style scoped lang="less">
  //
</style>
