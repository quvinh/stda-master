<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch, onMounted } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { useAppStore } from '@/store/modules/app';

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
    value: {
      type: Array as PropType<any[]>,
      default: () => [
        { value: 70, name: 'Usage' },
        { value: 30, name: 'Remain' },
      ],
    },
  });

  const appStore = useAppStore();
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  onMounted(() => {
    const total = props.value.reduce((sum, item) => sum + item.value, 0); // Calculate total value
    const usage = props.value.find((item) => item.name === 'Usage')?.value || 0; // Get 'Usage' value
    const usagePercent = ((usage / total) * 100).toFixed(2); // Calculate usage percentage

    setOptions({
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontFamily: 'Arial, sans-serif',
        },
      },
      series: [
        {
          name: 'Kho',
          type: 'pie',
          radius: ['50%', '90%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            fontSize: 18,
            color: appStore.getDarkMode === 'dark' ? '#fff' : '#333',
            fontWeight: 'bold',
            rich: {
              smallText: {
                fontSize: 12, // Smaller font size for "đã sử dụng"
                fontFamily: 'Arial, sans-serif',
                color: appStore.getDarkMode === 'dark' ? '#fff' : '#999', // Optional color change
              },
            },
            formatter: () => `${Number(usagePercent)}%\n{smallText|(đã sử dụng)}`, // Use rich formatter for smaller text
          },
          labelLine: {
            show: false,
          },
          data: props.value,
        },
      ],
    });
  });

  watch(
    () => props.value,
    (newValue) => {
      const total = newValue.reduce((sum, item) => sum + item.value, 0); // Recalculate total
      const usage = newValue.find((item) => item.name === 'Usage')?.value || 0; // Recalculate usage
      const usagePercent = ((usage / total) * 100).toFixed(2); // Recalculate percentage

      setOptions(
        {
          series: [
            {
              label: {
                formatter: () => `${Number(usagePercent)}%\n{smallText|(đã sử dụng)}`, // Update label with rich text formatting
              },
              data: newValue,
            },
          ],
        },
        false, // This is the `notMerge` option, it prevents full chart re-rendering
      );
    },
    { immediate: true },
  );
</script>
