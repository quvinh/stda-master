<template>
  <div
    class="p-1 border-gray-300 border-1 bg-white"
    ref="chartRef"
    :style="{ width, height }"
  ></div>
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
  const fakeDates = () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padEnd(2, '0');
      dates.unshift(`${day}/${month}`);
    }
    return dates;
  };

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        title: {
          text: 'Biểu đồ điện năng tiêu thụ',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: false },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ['Điện năng', 'Tiêu thụ'],
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        xAxis: [
          {
            type: 'category',
            data: fakeDates(),
            axisPointer: {
              type: 'shadow',
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Điện năng tiêu thụ (kWh)',
            min: 0,
            max: 300000,
            interval: 100000,
            axisLabel: {
              formatter: '{value} kWh',
            },
            nameTextStyle: {
              fontFamily: 'Arial, sans-serif',
            },
          },
        ],
        series: [
          {
            name: 'Điện năng',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return (value as number) + ' kWh';
              },
              textStyle: {
                fontFamily: 'Arial, sans-serif',
              },
            },
            data: [260439, 255489, 265768, 265489, 245768, 265439, 265489, 265768], // Dữ liệu tương ứng trong biểu đồ
            itemStyle: {
              color: '#73c0de',
            },
          },
          {
            name: 'Tiêu thụ',
            type: 'line',
            tooltip: {
              valueFormatter: function (value) {
                return (value as number) + ' kWh';
              },
              textStyle: {
                fontFamily: 'Arial, sans-serif',
              },
            },
            data: [260439, 255489, 265768, 265489, 245768, 265439, 265489, 265768], // Dữ liệu tương tự cho đường biểu diễn
            symbol: 'circle', // Biểu tượng của các điểm trên đường
            symbolSize: 8,
            lineStyle: {
              width: 2,
              color: '#5470c6',
            },
            itemStyle: {
              color: '#5470c6',
              borderWidth: 0,
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
