<template>
  <Button :class="props.class" :loading="props.loading" :type="props.type" :block="props.block">{{
    props.text
  }}</Button>
</template>

<script setup lang="ts">
  import { Button } from 'ant-design-vue';
  import { ButtonType } from 'ant-design-vue/es/button';

  const props = defineProps({
    loading: Boolean,
    text: String,
    class: String,
    block: Boolean,
    type: {
      type: String as PropType<ButtonType>,
      default: () => undefined,
    },
  });
</script>
