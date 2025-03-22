<template>
  <div id="radarChart" style="width: 100%; height: 300px"></div>
</template>

<script setup>
  import * as echarts from 'echarts';
  import { onMounted } from 'vue';

  onMounted(() => {
    const chartDom = document.getElementById('radarChart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: 'Biểu đồ Radar',
          left: 'center',
        },
        tooltip: {},
        radar: {
          indicator: [
            { name: 'Tốc độ', max: 100 },
            { name: 'Sức mạnh', max: 100 },
            { name: 'Phòng thủ', max: 100 },
            { name: 'Nhanh nhẹn', max: 100 },
            { name: 'Trí tuệ', max: 100 },
          ],
          shape: 'polygon', // Hình mạng nhện
        },
        series: [
          {
            name: 'Chỉ số',
            type: 'radar',
            data: [
              {
                value: [80, 90, 70, 85, 95], // Dữ liệu tương ứng với từng chỉ số
                name: 'Nhân vật A',
                areaStyle: { color: 'rgba(255, 99, 132, 0.5)' },
              },
            ],
          },
        ],
      };

      myChart.setOption(option);
    }
  });
</script>
