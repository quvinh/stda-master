<template>
  <div class="w-full h-full" ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch, PropType } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';

  const props = defineProps({
    data: {
      type: Array as PropType<
        Array<{
          process_id: string;
          errors: number;
          rate: number;
        }>
      >,
      default: () => [],
    },
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '100%',
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => props.data,
    (newData) => {
      if (props.loading || !newData.length) {
        return;
      }

      const chartData = newData.map((item) => ({
        value: item.errors,
        name: item.process_id,
      }));

      const legendData = newData.map((item) => item.process_id);

      setOptions({
        // title: {
        //   text: 'Tỷ lệ lỗi',
        //   left: 'center',
        //   textStyle: {
        //     fontFamily: 'Arial, sans-serif',
        //     fontSize: 16,
        //     fontWeight: 'bold',
        //   },
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        legend: {
          top: 5,
          left: 'left',
          data: legendData,
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
          itemWidth: 10,
          itemHeight: 10,
        },
        series: [
          {
            name: 'Biểu đồ tỷ lệ lỗi',
            type: 'pie',
            radius: '80%',
            center: ['50%', '51%', '60%', '50%'],
            selectedMode: 'single',
            data: chartData,
            top: 0,
            label: {
              show: true,
              position: 'inside',
              distance: 5,
              formatter: '{b}',
              fontFamily: 'Arial, sans-serif',
            },
            labelLine: {
              show: true,
              length: 5,
              length2: 5,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
