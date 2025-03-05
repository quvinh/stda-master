<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch, onMounted } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { useAppStore } from '@/store/modules/app';

  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '100%',
    },
    title: {
      type: String as PropType<string>,
      default: 'OEE',
    },
    value: {
      type: Number as PropType<number>,
      default: 0,
    },
  });

  const appStore = useAppStore();
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  onMounted(() => {
    setOptions({
      title: {
        text: props.title,
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 20,
          color: appStore.getDarkMode === 'dark' ? '#fff' : '#000',
          fontFamily: 'Arial, sans-serif',
        },
      },
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          progress: {
            show: true,
            width: 25,
          },
          axisLine: {
            lineStyle: {
              width: 25,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            distance: 3,
            length: 4,
            lineStyle: {
              width: 1,
              color: '#999',
            },
          },
          axisLabel: {
            distance: 30,
            color: '#999',
            fontSize: 10,
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 25,
            itemStyle: {
              borderWidth: 10,
            },
          },
          title: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            fontSize: 25,
            offsetCenter: [0, '70%'],
          },
          data: [
            {
              value: props.value,
            },
          ],
        },
      ],
    });
  });

  watch(
    () => props.value,
    (newValue) => {
      setOptions(
        {
          series: [
            {
              data: [
                {
                  value: newValue, // Only update the value
                },
              ],
            },
          ],
        },
        false, // This is the `notMerge` option, it prevents full chart re-rendering
      );
    },
    { immediate: true },
  );
</script>
