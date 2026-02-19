<script setup lang="ts">
defineProps<{
  type?: 'info' | 'success' | 'warning' | 'error'
}>()
</script>

<template>
  <div
    class="alert shadow-sm text-sm"
    :class="{
      'alert-info': type === 'info',
      'alert-success': type === 'success',
      'alert-warning': type === 'warning',
      'alert-error': type === 'error',
    }"
  >
    <slot></slot>
  </div>
</template>
