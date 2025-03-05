<template>
  <div class="charts-container">
    <Card
      class="h-full border-gray-300 border-1 full-height-card"
      :bodyStyle="{ padding: '2px!important', height: '100%' }"
      size="small"
      title="Tỷ lệ hoàn thành kế hoạch"
    >
      <div class="chart" id="chart3" :style="{ height: height + 'px' }"></div>
    </Card>
    <Card
      class="h-full border-gray-300 border-1 full-height-card"
      :bodyStyle="{ padding: '2px!important', height: '100%' }"
      size="small"
      title="Hiệu suất thiết bị"
    >
      <div class="chart-container">
        <div class="chart" id="chart1" :style="{ height: height + 'px' }"></div>
      </div>
    </Card>
    <Card
      class="h-full border-gray-300 border-1 full-height-card"
      :bodyStyle="{ padding: '2px!important', height: '100%' }"
      size="small"
      title="Tỷ lệ đạt chất lượng OQC"
    >
      <div class="chart" id="chart2" :style="{ height: height + 'px' }"></div>
    </Card>
    <Card
      class="h-full border-gray-300 border-1 full-height-card"
      :bodyStyle="{ padding: '2px!important', height: '100%' }"
      size="small"
      title="Tỷ lệ lỗi công đoạn"
    >
      <div class="chart" id="chart4" :style="{ height: height + 'px' }"></div>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import * as echarts from 'echarts';
  import { Card } from 'ant-design-vue';
  import dayjs from 'dayjs';

  const height = ref(window.innerHeight / 4.8);

  const initChart = (
    id: string,
    data: { xData: string[]; yData: number[]; target: number[]; seriesName: string },
    max: number = 100,
  ) => {
    const chart = echarts.init(document.getElementById(id) as HTMLElement);
    const options = {
      grid: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.xData,
      },
      yAxis: { type: 'value', max },
      series: [
        {
          name: data.seriesName,
          type: 'bar',
          data: data.yData,
          color: '#4a90e2',
        },
        {
          name: 'Mục tiêu',
          type: 'line',
          data: data.target,
          color: '#f5a623',
        },
      ],
    };
    chart.setOption(options);
  };

  function getLast7Days() {
    const days: any[] = [];

    for (let i = 6; i >= 0; i--) {
      days.push(dayjs().subtract(i, 'day').format('DD/MM'));
    }

    return days;
  }

  function getRandomValue(min: number, max: number): number {
    return parseInt((Math.random() * (max - min) + min).toFixed(2));
  }

  function generateRandomYData(length, min, max) {
    const yData: any[] = [];
    for (let i = 0; i < length; i++) {
      yData.push(getRandomValue(min, max));
    }
    return yData;
  }

  onMounted(() => {
    initChart('chart1', {
      xData: getLast7Days(),
      yData: generateRandomYData(7, 85, 93),
      target: [85, 85, 85, 85, 85, 85, 85],
      seriesName: 'Tỷ lệ đạt',
    });

    initChart('chart2', {
      xData: getLast7Days(),
      yData: generateRandomYData(7, 85, 93),
      target: [85, 85, 85, 85, 85, 85, 85],
      seriesName: 'Tỷ lệ vận hành TB',
    });

    initChart('chart3', {
      xData: getLast7Days(),
      yData: generateRandomYData(7, 85, 93),
      target: [90, 90, 90, 90, 90, 90, 90],
      seriesName: 'Tỷ lệ hoàn thành kế hoạch',
    });

    initChart(
      'chart4',
      {
        xData: getLast7Days(),
        yData: [0, 0, 2, 1, 0, 1, 0],
        target: [2, 2, 2, 2, 2, 2, 2],
        seriesName: 'Tỷ lệ lỗi công đoạn',
      },
      5,
    );
  });
</script>

<style scoped>
  .full-height-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .charts-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    flex: 1;
    flex-direction: column;
    height: 100%;
    gap: 2px;
  }

  .chart-container {
    display: flex;
    flex: 1; /* Chiếm toàn bộ chiều cao còn lại trong card body */
    flex-direction: column;
  }

  .chart {
    flex: 1;
    width: 100%;
  }
</style>
