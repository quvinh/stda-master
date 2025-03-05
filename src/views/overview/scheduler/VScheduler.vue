<template>
  <VueScheduler
    :end="newEnd"
    :events="newData"
    :headers="timelineHeaders"
    :identifiers="timelineItems"
    :options="newOptions"
    :start="newStart"
  >
    <template #event="{ event }">
      <div class="flex flex-col truncate p-2 text-xs text-white">
        <div class="font-bold">{{ event.meta?.title }}</div>
        <div class="text-slate-200">{{ event.meta?.description }}</div>
        <div class="text-slate-300">{{ event.start }} - {{ event.end }}</div>
        <div class="text-slate-300">{{ event.end }}</div>
      </div>
    </template>
  </VueScheduler>
</template>

<script setup lang="ts">
  import VueScheduler from '@/components/VueScheduler/VueScheduler.vue';
  import { ref } from 'vue';

  interface Event {
    identiferIdx: number;
    start: Date;
    end: Date;
    meta?: {
      class?: string;
      description?: string;
      text?: string;
      title?: string;
    };
  }

  /**
   * Generate row data
   */
  const timelineItems = [
    ['BMON-A', '08:00am'],
    ['BMON-B', '08:00am'],
    ['BMON-C', '08:00am'],
    ['BMON-D', '08:00am'],
    ['BMON-E', '08:00am'],
    ['BMON-F', '08:00am'],
    ['BMON-G', '08:00am'],
  ];
  const newStart = new Date(2024, 1, 1, 0, 0);
  const newEnd = new Date(2024, 1, 2, 23, 0);
  const timelineHeaders = ref(['Route', 'Start time']);
  const newData = ref<Event[]>([
    {
      identiferIdx: 0,
      start: new Date(2024, 1, 1, 1, 15),
      end: new Date(2024, 1, 1, 2, 0),
      meta: {
        title: 'Event 1',
        description: 'Event 1 description',
        class: 'bg-emerald-500 opacity-80 rounded-md',
      },
    },
    {
      identiferIdx: 1,
      start: new Date(2024, 1, 1, 3, 0),
      end: new Date(2024, 1, 1, 5, 0),
      meta: {
        title: 'Event 2',
        description: 'Event 2 description',
        class: 'bg-red-500 opacity-80 rounded-md',
      },
    },
    {
      identiferIdx: 2,
      start: new Date(2024, 1, 1, 7, 0),
      end: new Date(2024, 1, 1, 9, 0),
      meta: {
        title: 'Event 3',
        description: 'Event 3 description',
        class: 'bg-sky-700 opacity-80 rounded-md',
      },
    },
  ]);
  const newOptions = ref({
    cellWidth: 50,
    rowHeight: 81,
    scaleUnit: 'minutes',
    scaleCustom: 1.5,
    scrollSpeed: 5,
    timeFormat: 'HH:mm',
  });
</script>
