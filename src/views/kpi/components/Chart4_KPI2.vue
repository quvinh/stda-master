<template>
  <div class="border border-1 border-gray-300 p-1 h-full w-full shadow-md">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-bold text-gray-600 dark:text-white">Tỉ lệ sử dụng vị trí kho</h3>
      <Select v-model:value="sortOption" class="w-40" placeholder="Sắp xếp theo" size="small">
        <SelectOption value="ascending">Tăng dần</SelectOption>
        <SelectOption value="descending">Giảm dần</SelectOption>
      </Select>
    </div>

    <div class="mt-1 space-y-2">
      <div
        v-for="(location, index) in sortedLocations"
        :key="index"
        class="flex items-center justify-between"
      >
        <span class="font-semibold">{{ location.name }}</span>
        <Progress
          :size="20"
          :percent="location.usage"
          :stroke-color="getColor(location.usage)"
          :status="location.usage === 100 ? 'exception' : 'active'"
          class="flex-1 mx-4"
        />
        <!-- <span class="font-bold">{{ location.usage }}%</span> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Progress, Select, SelectOption } from 'ant-design-vue';

  // Define your data
  const locations = ref([
    { name: 'Location-001', usage: 80 },
    { name: 'Location-002', usage: 70 },
    { name: 'Location-003', usage: 60 },
    { name: 'Location-004', usage: 70 },
    { name: 'Location-005', usage: 60 },
    { name: 'Location-006', usage: 70 },
    { name: 'Location-007', usage: 95 },
    // { name: 'Location-008', usage: 95 },
    // { name: 'Location-009', usage: 95 },
    { name: 'Location-010', usage: 60 },
    { name: 'Location-011', usage: 30 },
    { name: 'Location-012', usage: 30 },
    { name: 'Location-013', usage: 70 },
  ]);

  // Sorting options
  const sortOption = ref('ascending');

  // Computed property to sort the locations
  const sortedLocations = computed(() => {
    return locations.value.slice().sort((a, b) => {
      return sortOption.value === 'ascending' ? a.usage - b.usage : b.usage - a.usage;
    });
  });

  // Function to change progress bar color based on usage
  const getColor = (usage: number) => {
    if (usage >= 90) return '#FF9E49'; // Orange
    if (usage >= 70) return '#FFE388'; // Yellow
    return '#606060'; // Gray
  };
</script>

<style scoped>
  /* Additional styles if needed */
</style>
