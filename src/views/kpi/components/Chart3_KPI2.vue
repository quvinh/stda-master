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
          text: 'Tỷ lệ lỗi chất lượng',
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
          formatter: function (params) {
            let result = '';
            params.forEach(function (item) {
              if (item.seriesName === 'Lỗi') {
                result += `${item.marker} ${item.seriesName}: ${item.value}<br/>`;
              }
            });
            return result;
          },
        },
        legend: {
          show: false, // Ẩn legend
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
          boundaryGap: true, // Đặt boundaryGap thành true để biểu đồ cột hiển thị chính xác
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
            name: 'Số lỗi',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210, 230, 210],
            lineStyle: {
              width: 3, // Đường dày hơn
              color: '#606060',
            },
            itemStyle: {
              color: '#606060', // Màu cam cho cột "Lỗi"
            },
            symbolSize: 6, // Tăng kích thước chấm tròn
          },
          {
            name: 'Lỗi',
            type: 'bar', // Biểu đồ cột
            data: [220, 182, 191, 234, 290, 330, 310, 330, 310],
            itemStyle: {
              color: '#FF9E49', // Màu cam cho cột "Lỗi"
            },
            barWidth: '50%', // Điều chỉnh độ rộng của cột nếu cần
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
