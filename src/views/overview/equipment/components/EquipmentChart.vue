<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch, onMounted } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';

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
        { value: 50, name: 'Usage' },
        { value: 50, name: 'Remain' },
      ],
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  onMounted(() => {
    setOptions({
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontFamily: 'Arial, sans-serif',
        },
      },
      series: [
        {
          name: 'Thiết bị',
          type: 'pie',
          radius: ['45%', '90%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
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
      setOptions(
        {
          series: [
            {
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
