<template>
  <div class="md:flex">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <Card
        size="small"
        :loading="loading"
        :title="item.title"
        class="md:w-1/4 w-full !md:mt-0 shadow-md"
        :class="{ '!md:mr-1': index + 1 < 4, '!mt-1': index > 0 }"
      >
        <template #extra>
          <Tag :color="item.color">{{ item.action }}</Tag>
        </template>

        <div class="py-1 px-1 flex justify-between items-center">
          <CountTo
            :startVal="1"
            :endVal="item.value"
            prefix="%"
            :decimals="2"
            class="text-3xl font-600"
          />
          <Icon :icon="item.icon" :size="40" />
        </div>

        <div class="p-2 px-1 flex justify-between">
          <span>Tỷ lệ mục tiêu</span>
          <CountTo
            :startVal="1"
            :endVal="item.total"
            prefix="%"
            :decimals="2"
            class="font-semibold"
          />
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { CountTo } from '@/components/CountTo';
  import Icon from '@/components/Icon/Icon.vue';
  import { Tag, Card } from 'ant-design-vue';
  import { growCardList } from '../data';

  defineProps({
    loading: {
      type: Boolean,
    },
  });
</script>
