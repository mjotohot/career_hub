<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title?: string
  message?: string
}>()

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <dialog class="modal modal-bottom sm:modal-middle z-9999" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-sm">
      <h3 class="font-bold text-base mb-2">{{ title ?? 'Remarks' }}</h3>
      <p class="text-sm text-base-content/70">{{ message }}</p>
      <div class="modal-action mt-6">
        <button class="btn btn-ghost btn-sm" @click="emit('close')">Close</button>
      </div>
    </div>
    <div class="modal-backdrop bg-black/30" @click="emit('close')" />
  </dialog>
</template>
