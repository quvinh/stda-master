<template>
  <div class="p-1" ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import dayjs from 'dayjs';
  import { formatNumber } from '@/utils/helper/tsxHelper';

  const props = defineProps({
    loading: Boolean,
    data: {
      type: Array as PropType<any>,
    },
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

  // Generate dates for the current week
  const xAxisData = Array.from({ length: 7 }, (_, i) =>
    dayjs()
      .subtract(6 - i, 'day')
      .format('DD/MM'),
  );

  watch(
    () => ({
      loading: props.loading,
      OEEData: props.data.map((item) => formatNumber(Number(item.oee)) || 0),
      AData: props.data.map((item) => formatNumber(Number(item.a)) || 0),
      PData: props.data.map((item) => formatNumber(Number(item.p)) || 0),
      QData: props.data.map((item) => formatNumber(Number(item.q)) || 0),
      dates: props.data.map((item) => formatNumber(Number(item.date)) || 0),
    }),
    (value) => {
      if (props.loading) {
        return;
      }
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
          data: ['OEE', 'A', 'P', 'Q'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          data: value.dates.length > 0 ? value.dates : xAxisData,
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLabel: {
            formatter: '{value}%',
          },
        },
        series: [
          {
            name: 'A',
            type: 'bar',
            data: value.AData,
            itemStyle: {
              color: '#ffa940',
            },
          },
          {
            name: 'P',
            type: 'bar',
            data: value.PData,
            itemStyle: {
              color: '#36cfc9',
            },
          },
          {
            name: 'Q',
            type: 'bar',
            data: value.QData,
            itemStyle: {
              color: '#597ef7',
            },
          },
          {
            name: 'OEE',
            type: 'line',
            data: value.OEEData.length > 0 ? value.OEEData : [0, 0, 0, 0, 0, 0, 0],
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: {
              width: 2,
              color: '#ff4d4f',
            },
            itemStyle: {
              color: '#ff4d4f',
              borderWidth: 0,
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
