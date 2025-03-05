<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <AssessmentSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="Thực hiện đánh giá chuyển đổi số"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Card } from 'ant-design-vue';
  import { ref } from 'vue';
  import AssessmentSidebar from './components/AssessmentSidebar.vue';

  const filter = ref<any>();

  function handleSidebarFilter(values: any) {
    console.log(values);
  }
</script>
