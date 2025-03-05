<template>
  <GGanttChart
    chart-start="00:00"
    chart-end="23:59"
    precision="hour"
    date-format="HH:mm"
    bar-start="beginDate"
    bar-end="endDate"
    grid
    no-overlap
  >
    <template #upper-timeunit>
      <h1>{{ dayjs().format('DD-MM-YYYY') }}</h1>
    </template>
    <GGanttRow
      v-for="(plan, index) in context"
      :key="index"
      :bars="plan.tasks"
      :label="`Line ${plan.planId}`"
      highlight-on-hover
    />
  </GGanttChart>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { GGanttChart, GGanttRow } from '@infectoone/vue-ganttastic';
  import dayjs from 'dayjs';

  // Hàm tạo nhiệm vụ với thời gian kéo dài khoảng 2 giờ
  function createTasks(startTime: string, numberOfTasks: number, planId: number) {
    const tasks: any[] = [];
    let currentTime = dayjs(startTime, 'HH:mm');
    let taskId = planId * 100; // Đảm bảo taskId là duy nhất cho mỗi kế hoạch

    for (let i = 0; i < numberOfTasks; i++) {
      const beginTime = currentTime.format('HH:mm');
      currentTime = currentTime.add(Math.random() * (4.5 - 1.9) + 1.9, 'hour'); // Random 1.9 -> 4.5h
      const endTime = currentTime.format('HH:mm');

      tasks.push({
        beginDate: `${beginTime}`,
        endDate: `${endTime}`,
        ganttBarConfig: {
          id: `${taskId}`,
          hasHandles: true,
          label: `${['DW.1807', 'SNR.LBL'][Math.floor(Math.random() * 2)]}-${taskId}`,
          style: {
            background: ['#ffa64d', '#4da6ff', '#ff66a3'][Math.floor(Math.random() * 3)], // Màu ngẫu nhiên
          },
        },
      });

      taskId++;
    }

    return tasks;
  }

  // Cập nhật context với mỗi kế hoạch chỉ có 1 hoặc 2 nhiệm vụ
  const context = ref([
    {
      planId: 1,
      tasks: createTasks('00:00', 2, 1), // Bắt đầu từ 0h, 2 nhiệm vụ
    },
    {
      planId: 2,
      tasks: createTasks('04:00', 3, 2), // Bắt đầu từ 4h, 1 nhiệm vụ
    },
    {
      planId: 3,
      tasks: createTasks('08:00', 2, 3), // Bắt đầu từ 8h, 2 nhiệm vụ
    },
    {
      planId: 4,
      tasks: createTasks('12:00', 2, 4), // Bắt đầu từ 12h, 1 nhiệm vụ
    },
    {
      planId: 5,
      tasks: createTasks('16:00', 2, 5), // Bắt đầu từ 16h, 2 nhiệm vụ
    },
    {
      planId: 6,
      tasks: createTasks('20:00', 2, 6), // Bắt đầu từ 20h, 1 nhiệm vụ
    },
  ]);
</script>
