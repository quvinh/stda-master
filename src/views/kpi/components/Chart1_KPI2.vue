<template>
  <div
    class="border-gray-300 border-1 bg-white shadow-md"
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
    for (let i = 0; i < 9; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padEnd(2, '0');
      dates.unshift(`${day}/${month}`);
    }
    return dates;
  };

  const dateArray = fakeDates();

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        title: {
          text: 'Tỷ lệ thực thi theo kế hoạch sản xuất',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        legend: {
          data: ['Kế hoạch', 'Thực tế'],
          right: 50, // Căn chỉnh legend sang phải
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
          boundaryGap: false,
          data: dateArray,
          splitLine: {
            show: true, // Hiển thị lưới dọc
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333',
            },
          },
          splitLine: {
            show: true, // Hiển thị lưới ngang
          },
        },
        series: [
          {
            name: 'Kế hoạch',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210, 230, 210],
            lineStyle: {
              width: 3, // Đường dày hơn
              color: '#606060',
            },
            itemStyle: {
              color: '#606060',
            },
            symbolSize: 6, // Tăng kích thước chấm tròn
          },
          {
            name: 'Thực tế',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310, 330, 310],
            lineStyle: {
              width: 3, // Đường dày hơn
              color: '#FF9E49', // Màu cam cho đường "Thực tế"
            },
            itemStyle: {
              color: '#FF9E49',
            },
            symbolSize: 6, // Tăng kích thước chấm tròn
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
