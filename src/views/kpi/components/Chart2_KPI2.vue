<template>
  <div class="h-full w-full flex flex-col pt-2 justify-center items-center">
    <div class="flex flex-col justify-center items-center">
      <div class="font-semibold text-size-4">{{ props.title }}</div>
      <div class="font-semibold text-size-3">{{ props.subTitle }}</div>
    </div>
    <div ref="chartRef" :style="{ width, height }"></div>
  </div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch, onMounted } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { useAppStore } from '@/store/modules/app';
  import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';

  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '100%',
    },
    title: {
      type: String as PropType<string>,
      default: 'OEE (%)',
    },
    subTitle: {
      type: String as PropType<string>,
      default: '',
    },
    value: {
      type: Array as PropType<any[]>,
      default: () => [
        { value: 70, name: 'Usage' },
        { value: 30, name: 'Remain' },
      ],
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const appStore = useAppStore();

  function calculateOptions(value: any[], colorSmallText: string) {
    const total = value.reduce((sum, item) => sum + item.value, 0);
    const usage = value.find((item) => item.name === 'Usage')?.value || 0;
    const usagePercent = ((usage / total) * 100).toFixed(2);

    return {
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontFamily: 'Arial, sans-serif',
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '90%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            rich: {
              smallText: {
                fontSize: 14,
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                color: colorSmallText,
              },
            },
            formatter: () => `{smallText|${Number(usagePercent)}%}`,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: usage,
              name: 'Usage',
              itemStyle: { color: '#FF9E49' },
            },
            {
              value: total - usage,
              name: 'Remain',
              itemStyle: { color: '#606060' },
            },
          ],
        },
      ],
    };
  }

  function freshData(value: any[], colorSmallText = '#313131') {
    const options: any = calculateOptions(value, colorSmallText);
    setOptions(options, false);
  }

  onMounted(() => {
    const colorSmallText = appStore.getDarkMode === 'dark' ? '#fff' : '#313131';
    freshData(props.value, colorSmallText);
  });

  watch(
    () => props.value,
    (newValue) => {
      const colorSmallText = appStore.getDarkMode === 'dark' ? '#fff' : '#313131';
      freshData(newValue, colorSmallText);
    },
    { immediate: true },
  );

  watch(
    () => appStore.getDarkMode,
    (newMode) => {
      const colorSmallText = newMode === 'dark' ? '#fff' : '#313131';
      freshData(props.value, colorSmallText);
    },
  );
</script>
