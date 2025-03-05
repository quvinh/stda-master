<template>
  <div
    class="p-5"
    ref="chartRef"
    :style="{
      width,
      height,
    }"
  ></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { formatNumber } from '@/utils/helper/tsxHelper';

  const props = defineProps({
    loading: Boolean,
    data: {
      type: Array as PropType<any>,
    },
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '110%',
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => ({
      loading: props.loading,
      importData: props.data
        ?.filter((item) => item.import_time) // Lọc các item có giá trị import_time
        .map((item) => parseFloat(String(item.import_quantity).replace(/,/g, '')) || 0),

      exportData: props.data
        ?.filter((item) => item.export_time) // Lọc các item có export_time
        .map((item) => parseFloat(String(item.export_quantity).replace(/,/g, '')) || 0),

      inventoryData: props.data.map(
        (item) => parseFloat(String(item.remaining_quantity).replace(/,/g, '')) || 0,
      ),

      warehouse: props.data.map((item) => item.warehouse_id),
    }),
    (values) => {
      console.log(props.data);
      const max = Math.max(...values.importData, ...values.exportData, ...values.inventoryData);
      const min = Math.min(...values.importData, ...values.exportData, ...values.inventoryData);
      if (props.loading) {
        return;
      }
      setOptions({
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (params) {
            let tooltipText = params[0].name + '<br/>';
            params.forEach(function (item) {
              tooltipText += item.marker + item.seriesName + ': ' + item.value + '<br/>';
            });
            return tooltipText;
          },
        },
        legend: {
          data: ['Nhập', 'Xuất', 'Tồn'],
          top: 0,
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '4%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          data: values.warehouse,
        },
        yAxis: [
          {
            type: 'value',
            max,
            min,
            // interval: 6,
            position: 'left',
            axisLabel: {
              formatter: function (value) {
                return value > 0 ? `${value}` : '0';
              },
            },
          },
        ],
        series: [
          {
            name: 'Nhập',
            type: 'bar',
            data: values.importData,
            itemStyle: {
              color: 'blue',
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}',
              color: 'white',
              fontSize: '10px',
              fontFamily: 'Arial, sans-serif',
            },
          },
          {
            name: 'Xuất',
            type: 'bar',
            data: values.exportData,
            itemStyle: {
              color: 'orange',
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}',
              color: 'white',
              fontFamily: 'Arial, sans-serif',
              fontSize: '10px',
            },
          },
          {
            name: 'Tồn',
            type: 'bar',
            data: values.inventoryData,
            itemStyle: {
              color: 'grey',
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}',
              color: 'white',
              fontFamily: 'Arial, sans-serif',
              fontSize: '10px',
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
