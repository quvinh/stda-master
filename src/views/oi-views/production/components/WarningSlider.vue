<template>
  <!-- <div class="footer-slider">
    <div class="flex flex-row gap-5 w-full slider-content">
      <div v-for="(msg, index) in props.warningMessages" :key="index">
        <span class="underline font-600 text-size-4 text-red-600">{{ msg }}</span>
      </div>
    </div>
  </div> -->
  <div class="flex flex-row gap-5 w-full overflow-auto flex-nowrap bg-red-600 p-1">
    <span
      v-for="(msg, index) in props.warningMessages"
      :key="index"
      class="underline font-600 text-size-4 text-white whitespace-nowrap"
      >{{ msg }}</span
    >
  </div>
</template>

<script lang="ts" setup>
  interface Props {
    warningMessages: string[];
  }

  const props = defineProps<Props>();
</script>

<style scoped>
  @keyframes scroll-left {
    0% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes scroll-right {
    0% {
      transform: translateX(-100%);
    }

    100% {
      transform: translateX(100%);
    }
  }

  .footer-slider {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 5px 0; /* Khoảng cách trên và dưới */
    overflow: hidden;
    background-color: #fff8e1; /* Màu nền nhẹ cho footer */
    white-space: nowrap;
  }

  .slider-content {
    animation: scroll-left 25s linear infinite;
  }
</style>
