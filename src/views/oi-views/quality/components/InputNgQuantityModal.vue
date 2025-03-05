<!-- InputNgQuantityModal.vue -->
<template>
  <Modal
    v-model:open="props.visible"
    title="Input NG Quantity"
    width="500px"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form @submit.prevent="handleOk">
      <a-form-item label="Process ID">
        <a-input :value="props.process_id" disabled />
      </a-form-item>
      <a-form-item label="Lot ID">
        <a-input :value="props.lot_id" disabled />
      </a-form-item>
      <a-form-item label="NG Quantity">
        <a-input-number v-model:value="ng_quantity" min="0" />
      </a-form-item>
      <a-form-item v-if="loading" label="">
        <a-spin tip="Loading criteria..." />
      </a-form-item>
      <a-form-item v-if="props.error_qualities.length > 0" label="Criteria">
        <ul>
          <li v-for="item in props.error_qualities" :key="item.id">{{ item?.error_quality_name }}</li>
        </ul>
      </a-form-item>
    </a-form>
  </Modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import IErrorQuality from '@/api/model/IErrorQuality';
import Modal from 'ant-design-vue/lib/modal';

interface Props {
  visible: boolean;
  process_id: number;
  lot_id: number;
  error_qualities: IErrorQuality[];
}

const props = defineProps<Props>();
const emit = defineEmits(['ok', 'cancel']);

const ng_quantity = ref<number>(0);
const loading = ref<boolean>(false);
function handleOk() {
  emit('ok', {
    process_id: props.process_id,
    lot_id: props.lot_id,
    ng_quantity: ng_quantity.value,
  });
}

function handleCancel() {
  emit('cancel');
}
</script>

<style scoped>
</style>
