<template>
  <div id="chart" style="width: 100%; height: 350px"></div>
  <!-- Tăng chiều cao -->
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
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '20%', // Lề trái để không bị cắt chữ
          right: '10%',
          top: '5%', // 🟢 Đẩy biểu đồ lên trên
          bottom: '30%',
        },
        xAxis: {
          type: 'value',
          // name: 'Giá trị',
        },
        yAxis: {
          type: 'category',
          data: [
            'AVERAGE OF ALL DIMENSIONS',
            'D1 STRATEGY & LEADERSHIP',
            'D2 PEOPLE & CULTURE',
            'D3 CUSTOMERS',
            'D4 OPERATIONS',
            'D5 PRODUCTION',
            'D6 DIGITAL TECHNOLOGY & SECURITY',
            'D7 SUSTAINABILITY & INCLUSION',
          ],
          axisLabel: {
            interval: 0, // Hiển thị tất cả nhãn
            fontSize: 10, // Giảm kích thước chữ
            overflow: 'break', // Bọc dòng nếu quá dài
          },
        },
        series: [
          {
            name: 'Dữ liệu',
            type: 'bar',
            data: [10, 20, 30, 40, 50, 10, 30, 20],
            barWidth: 20, // Giảm độ rộng cột
            // barCategoryGap: '10%',
            itemStyle: {
              color: '#409EFF',
            },
          },
        ],
      };

      myChart.setOption(option);
    }
  });
</script>
