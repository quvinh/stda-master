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
      // backgroundColor: '#161627',
      title: {
        text: 'Basic Radar Chart',
        left: 'center',
        textStyle: {
          fontFamily: 'Arial, sans-serif',
          // color: '#eee',
        },
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontFamily: 'Arial, sans-serif',
        },
      },
      legend: {
        show: false,
      },
      radar: {
        shape: 'circle',
        center: ['50%', '55%'],
        radius: '70%',
        indicator: [
          { name: 'Sales', max: 6500 },
          { name: 'Administration', max: 16000 },
          { name: 'Information Technology', max: 30000 },
          { name: 'Customer Support', max: 38000 },
          { name: 'Development', max: 52000 },
          { name: 'Marketing', max: 25000 },
        ],
        splitLine: {
          lineStyle: {
            color: ['rgba(238, 197, 102, 1)'].reverse(),
          },
        },
        splitArea: {
          show: false,
        },
      },
      series: [
        {
          type: 'radar',
          tooltip: {
            trigger: 'item',
            textStyle: {
              fontFamily: 'Arial, sans-serif',
            },
          },
          areaStyle: {},
          data: [
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending',
            },
          ],
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
