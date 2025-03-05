<template>
  <div class="p-1" ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
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
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      const OEEData = [15, 17, 9, 14, 17, 14, 18];
      const AData = [11, 13, 16, 15, 13, 12, 17];
      const PData = [15, 16, 14, 18, 9, 13, 13];
      const QData = [15, 13, 18, 12, 9, 16, 12];
      const SData = [5, 8, 2, 4, 9, 3, 7];

      setOptions({
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (params) {
            let tooltipText = params[0].name + '<br/>';
            params.forEach(function (item) {
              tooltipText += item.marker + item.seriesName + ': ' + item.value + '%<br/>';
            });
            return tooltipText;
          },
        },
        legend: {
          data: ['BE', 'BOI', 'DAN', 'EPNHU', 'KIEMHANG', 'IN'],
          top: '3%',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '9%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          data: ['08/12/2024', '09/12/2024', '10/12/2024', '11/12/2024', '12/12/2024'],
        },
        yAxis: [
          {
            type: 'value',
            max: 18,
            min: 0,
            interval: 6,
            position: 'left',
            axisLabel: {
              formatter: '{value}k',
            },
          },
          {
            type: 'value',
            max: 120,
            min: 0,
            interval: 40,
            position: 'right',
            axisLabel: {
              formatter: '{value}%',
            },
          },
        ],
        series: [
          {
            name: 'BE',
            type: 'bar',
            data: AData,
            itemStyle: {
              color: '#e15219',
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}.000',
              color: 'white',
              fontSize: '10px',
            },
          },
          {
            name: 'BOI',
            type: 'bar',
            data: PData,
            itemStyle: {
              color: '#e38e6c',
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}.000',
              color: 'white',
              fontSize: '10px',
            },
          },
          {
            name: 'DAN',
            type: 'bar',
            data: QData,
            itemStyle: {
              color: '#f10519',
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}.000',
              color: 'white',
              fontSize: '10px',
            },
          },
          {
            name: 'EPNHU',
            type: 'bar',
            data: QData,
            itemStyle: {
              color: '#e7767f',
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}.000',
              color: 'white',
              fontSize: '10px',
            },
          },
          {
            name: 'KIEMHANG',
            type: 'bar',
            data: SData,
            itemStyle: {
              color: '#d7a037',
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}.000',
              color: 'white',
              fontSize: '10px',
            },
          },
          {
            name: 'IN',
            type: 'line',
            data: OEEData,
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: {
              width: 2,
            },
            itemStyle: {
              color: '#ff7875',
              borderWidth: 0,
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
