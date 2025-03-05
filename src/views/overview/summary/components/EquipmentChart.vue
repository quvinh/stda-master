<template>
  <div class="border-gray-300 border-1 shadow-md" ref="chartRef" :style="{ width, height }"></div>
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
      setOptions({
        title: {
          text: 'Thiết bị',
          left: 'center',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        legend: {
          top: 30, // Đưa legend lên trên
          left: 'center',
          data: ['BỒI', 'CÁN', 'BẾ', 'DÁN', 'IN'],
          textStyle: {
            fontSize: 10, // Giảm kích thước font của legend
          },
          itemWidth: 10, // Giảm chiều rộng của biểu tượng trong legend
          itemHeight: 10, // Giảm chiều cao của biểu tượng trong legend
        },
        series: [
          {
            name: 'Thiết bị',
            type: 'pie',
            radius: '65%',
            center: ['50%', '60%'], // Di chuyển biểu đồ tròn xuống dưới bằng cách tăng giá trị trục Y
            selectedMode: 'single',
            data: [
              { value: 2, name: 'Máy dừng' },
              { value: 100, name: 'Máy hoạt động' },
            ],
            label: {
              show: true,
              position: 'outside',
              distance: 5, // Giảm khoảng cách từ điểm đến nhãn
              formatter: '{b}',
            },
            labelLine: {
              show: true,
              length: 5, // Giảm chiều dài của đường nối nhãn
              length2: 5, // Giảm chiều dài đường thứ hai
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
