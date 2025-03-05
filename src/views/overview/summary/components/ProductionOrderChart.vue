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
          text: 'Tình hình đơn hàng sản xuất',
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
        series: [
          {
            name: 'Tình hình đơn hàng sản xuất',
            type: 'pie',
            radius: '65%',
            center: ['50%', '60%'], // Di chuyển biểu đồ tròn xuống dưới bằng cách tăng giá trị trục Y
            selectedMode: 'single',
            data: [
              { value: 735, name: 'Đơn hàng mới' },
              { value: 510, name: 'Đơn tạm dừng' },
              { value: 434, name: 'Đơn sản xuất' },
              { value: 1548, name: 'Đơn hoàn thành' },
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
