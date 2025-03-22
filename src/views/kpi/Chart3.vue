<template>
  <div style="width: 100%; height: 400px"></div>
</template>

<script setup>
  import * as echarts from 'echarts';
  import { onMounted } from 'vue';

  onMounted(() => {
    const chartDom = document.getElementById('chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: 'Biểu đồ bánh',
          left: 'center',
          top: '5%', // Đẩy tiêu đề lên trên
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: '20%', // Đẩy legend xuống
        },
        series: [
          {
            name: 'Tỷ lệ',
            type: 'pie',
            radius: '50%',
            center: ['50%', '65%'], // Đẩy biểu đồ xuống thấp (mặc định là ["50%", "50%"])
            data: [
              { value: 40, name: 'Danh mục A' },
              { value: 30, name: 'Danh mục B' },
              { value: 20, name: 'Danh mục C' },
              { value: 10, name: 'Danh mục D' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

      myChart.setOption(option);
    }
  });
</script>
