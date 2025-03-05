<template>
  <Breadcrumb>
    <BreadcrumbItem href="/quality"
      ><span class="text-dark font-semibold"
        ><Icon icon="ant-design:star-outlined" /> CHẤT LƯỢNG</span
      ></BreadcrumbItem
    >
    <BreadcrumbItem>
      <Dropdown>
        <span class="text-red-800 font-bold cursor-pointer"
          >{{ props.title }} <Icon icon="ant-design:down-outlined"
        /></span>
        <template #overlay>
          <Menu @click="handleMenuClick" :selected-keys="[props.keyActive]">
            <!-- <MenuItem key="qc">QUẢN LÝ CHẤT LƯỢNG</MenuItem> -->
            <MenuItem key="dd">QUẢN LÝ ĐẦU ĐƠN</MenuItem>
            <MenuItem key="iqc">QUẢN LÝ IQC</MenuItem>
            <MenuItem key="pqc">QUẢN LÝ PQC</MenuItem>
            <MenuItem key="oqc">QUẢN LÝ OQC</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { useGo } from '@/hooks/web/usePage';
  import { Breadcrumb, BreadcrumbItem, Dropdown, Menu, MenuItem } from 'ant-design-vue';

  const go = useGo();

  const props = defineProps({
    title: {
      type: String,
      default: 'QUẢN LÝ CHẤT LƯỢNG',
    },
    keyActive: {
      type: String,
      default: '',
    },
  });

  function handleMenuClick(value) {
    switch (value?.key) {
      case 'qc':
        go('/oi/quality');
        break;
      case 'dd':
        go('/oi/quality-dd');
        break;
      case 'iqc':
        go('/oi/quality-iqc');
        break;
      case 'pqc':
        go('/oi/quality-pqc');
        break;
      case 'oqc':
        go('/oi/quality-oqc');
        break;
      default:
        break;
    }
  }
</script>
