<template>
  <div
    class="border-gray-300 border-1 shadow-md bg-white"
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
    for (let i = 0; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1);
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
          text: 'Sản lượng và tỷ lệ lỗi chất lượng',
          left: 'center',
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
        legend: {
          left: 'center',
          textStyle: {
            fontSize: 12,
          },
          bottom: 10,
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
            name: 'Lỗi',
            nameRotate: 90,
            nameGap: 50,
            nameLocation: 'middle',
            min: 0,
            // max: 240,
            interval: 80,
            axisLabel: {
              formatter: '{value}e',
            },
          },
          {
            type: 'value',
            name: '%',
            nameRotate: -90,
            nameGap: 50,
            nameLocation: 'middle',
            min: 0,
            // max: 3600,
            // interval: 1200,
            axisLabel: {
              formatter: '{value}',
            },
          },
        ],
        series: [
          {
            name: 'Lỗi',
            barWidth: '30%',
            type: 'bar',
            tooltip: {
              textStyle: {
                fontFamily: 'Arial, sans-serif',
              },
              valueFormatter: function (value) {
                return (value as number) + 'k';
              },
            },
            data: [18.0, 19.0, 20.0, 5.0, 10.0, 9.0, 16.0, 2.0], // Dữ liệu tương ứng trong biểu đồ
            itemStyle: {
              color: '#73c0de',
            },
          },
          {
            name: '%',
            type: 'line',
            tooltip: {
              textStyle: {
                fontFamily: 'Arial, sans-serif',
              },
              valueFormatter: function (value) {
                return value as number;
              },
            },
            data: [18.0, 19.0, 20.0, 5.0, 10.0, 9.0, 16.0, 2.0], // Dữ liệu tương tự cho đường biểu diễn
            symbol: 'circle', // Biểu tượng của các điểm trên đường
            symbolSize: 8,
            lineStyle: {
              width: 2,
              color: '#FF9933',
            },
            itemStyle: {
              color: '#FF9933',
              borderWidth: 0,
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
